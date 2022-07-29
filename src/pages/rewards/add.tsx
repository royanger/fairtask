import Layout from '@components/ui/layout';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import { useHydratedSession, useUserInfoCheck } from '@utils/customHooks';
import { displayToast } from '@utils/displayToast';
import RewardHeader from '@components/rewards/RewardsHeader';
import { FormButton } from '@components/ui/FormButton';
import { AssignMember } from '@components/tasks/AssignMember';
import { useForm } from 'react-hook-form';
import { CategorySelector } from '@components/rewards/CategorySelector';

interface FormData {
	title: string;
	description: string;
	date: Date;
	value: number;
	assignedMember: string;
}

const AddRewards: NextPageWithLayout = () => {
	const session = useHydratedSession();
	const { isLoading, userInfo } = useUserInfoCheck(session.user.id);

	if (!isLoading && userInfo.hasEmail === false) {
		displayToast();
	}

	const handleAdd = () => {
		console.log('adding');
	};
	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			value: 0,
		},
	});

	const onSubmit = handleSubmit(async data => {
		const assignedId =
			data.assignedMember === 'both' ? null : data.assignedMember;

		console.log(data);

		// await addTaskMutation.mutate({
		// 	userId: session.user.id,
		// 	title: data.title,
		// 	description: data.description,
		// 	value: data.value,
		// 	date: data.date,
		// 	teamId: team?.teamId!,
		// 	assigned: assignedId,
		// });
	});

	return (
		<>
			<RewardHeader
				title="Add a Reward"
				buttonType="temp"
				buttonCallback={handleAdd}
			/>
			<div className="flex flex-col items-center">
				<div className="max-w-5xl w-full">
					<form onSubmit={onSubmit} className="px-2 ">
						<div className="py-4 px-3 flex flex-col rounded-3xl mb-4">
							<div className="flex flex-row mb-6">
								<label htmlFor="title" className="mr-2 sr-only">
									Reward Title
								</label>
								<input
									{...register('title', { required: true })}
									className="border-green border-b-2 w-full py-1 px-2 text-grey-900 text-xl"
									placeholder="Reward Title"
								/>
							</div>

							<div className="flex flex-row">
								<label htmlFor="description" className="mr-2 sr-only">
									Description
								</label>
								<input
									{...register('description', { required: true })}
									placeholder="Points needed"
									className="border-green border-b-2 w-full py-1 px-2 text-grey-900 text-xl"
								/>
							</div>
						</div>
						<CategorySelector register={register} />

						<div className="flex items-center justify-center">
							<FormButton>Submit</FormButton>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};
AddRewards.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<>
			<Layout>{page}</Layout>
		</>
	);
};

export default AddRewards;

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
