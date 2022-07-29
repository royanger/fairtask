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
import { trpc } from '@utils/trpc';
import Image from 'next/image';
import Router from 'next/router';

interface FormData {
	title: string;
	value: number;
	selectedCategory: string;
}

const AddRewards: NextPageWithLayout = () => {
	const session = useHydratedSession();
	const { isLoading, userInfo } = useUserInfoCheck(session.user.id);

	if (!isLoading && userInfo.hasEmail === false) {
		displayToast();
	}

	const { data: team } = trpc.useQuery([
		'user.getTeam',
		{ userId: session.user.id },
	]);

	const createRewardMutation = trpc.useMutation(['rewards.createReward'], {
		onSuccess: () => {
			Router.push('/rewards');
		},
	});

	const handleAdd = () => {};
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			value: 0,
		},
	});

	const onSubmit = handleSubmit(async data => {
		await createRewardMutation.mutate({
			title: data.title,
			points: +data.value,
			categoryId: data.selectedCategory,
			teamId: team?.teamId!,
		});
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
					<div className="mt-4">
						<Image
							src="/images/claim-reward.png"
							width={408}
							height={312}
							alt="Create a new reward"
						/>
					</div>
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
									Points Needed
								</label>
								<input
									{...register('value', { required: true })}
									placeholder="Points needed"
									className="border-green border-b-2 w-full py-1 px-2 text-grey-900 text-xl"
								/>
							</div>
						</div>
						<CategorySelector register={register} />

						<div className="flex items-center justify-center mb-20">
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
