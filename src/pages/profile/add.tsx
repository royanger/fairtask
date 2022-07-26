import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

// import components and utils
import { useHydratedSession, useUserInfoCheck } from '@utils/customHooks';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';
import Layout from '@components/ui/layout';
import { displayToast } from '@utils/displayToast';
import { trpc } from '@utils/trpc';
import { FormButton } from '@components/ui/FormButton';

const memberSchema = z.object({
	email: z.string().email(),
});

type MemberFormData = z.infer<typeof memberSchema>;

const AddHouseholdMember: NextPageWithLayout = () => {
	const session = useHydratedSession();
	const { isLoading, userInfo } = useUserInfoCheck(session.user.id);

	const { data: teamData, isLoading: isLoadingTeamData } = trpc.useQuery([
		'user.getTeam',
		{ userId: session.user.id },
	]);
	const addHouseholdMutation = trpc.useMutation(['user.addHouseholdMember']);
	const createTeamMutation = trpc.useMutation(['team.createTeam']);

	if (!isLoading && userInfo.hasEmail === false) {
		displayToast();
	}

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitSuccessful },
		setError: setErrorName,
	} = useForm<MemberFormData>();

	const onSubmitName = handleSubmit(async data => {
		const validation = memberSchema.safeParse(data);
		if (validation.success) {
			if (!teamData?.team) {
				await createTeamMutation.mutate({ userId: session.user.id });
			}

			addHouseholdMutation.mutate({
				userId: session.user.id,
				email: data.email,
			});
		} else {
			setErrorName('email', {
				type: 'custom',
				message: 'Please enter a valid name.',
			});
		}
	});

	return (
		<>
			<div className="p-4">
				<h1 className="text-xl  font-poppins">Add Household Member</h1>
				<div className="border-[1px] border-grey-100 mt-10 mb-12 p-4 shadow-md">
					<form onSubmit={onSubmitName}>
						<div className=" p-2 flex flex-col">
							<div className="flex flex-row">
								<label htmlFor="title">Name</label>
								<input
									{...register('email', { required: true })}
									className="border-[1px] border-grey-700 "
								/>
							</div>
						</div>
						<div>
							<FormButton>Send Invite</FormButton>
							{isSubmitSuccessful ? 'Name update' : ''}
						</div>
						<div>{errors.email && errors.email.message}</div>
					</form>
				</div>
			</div>
		</>
	);
};

AddHouseholdMember.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<>
			<Layout>{page}</Layout>
		</>
	);
};

export default AddHouseholdMember;

export const getServerSideProps: GetServerSideProps = async context => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions
	);

	if (!session) {
		return {
			redirect: {
				permanent: false,
				destination: `/login`,
			},
		};
	}
	return {
		props: {
			session: session,
		},
	};
};
