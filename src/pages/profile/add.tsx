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
			if (!teamData?.teamId) {
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
		<div className="flex flex-col items-center justify-center">
			<div className="p-4 md:max-w-2xl w-full">
				<h1 className="text-xl  font-poppins">Add Household Member</h1>
				<div className="border-[1px] border-grey-100 mt-10 mb-12 p-4 shadow-md">
					<form onSubmit={onSubmitName}>
						<div className=" p-2 flex flex-col">
							<div className="flex flex-row mt-4">
								<label htmlFor="title">Email</label>
								<input
									{...register('email', { required: true })}
									className="ml-2 border-[1px] border-grey-700 w-full"
								/>
							</div>
							<p className="mt-4">
								Please enter the email of the person you wish to invite
								to your household. When they login, they will be able to
								accept.
							</p>
						</div>
						<div className="my-4">
							<FormButton>Send Invite</FormButton>
							<span className="ml-4">
								{isSubmitSuccessful ? 'Invite sent!' : ''}
							</span>
						</div>
						<div>{errors.email && errors.email.message}</div>
					</form>
				</div>
			</div>
		</div>
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
