import { useHydratedSession, useUserInfoCheck } from '@utils/customHooks';
import Layout from '@components/ui/layout';
import { NextPageWithLayout } from './_app';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import RewardHeader from '@components/rewards/RewardsHeader';
import Router from 'next/router';
import { displayToast } from '@utils/displayToast';
import { trpc } from '@utils/trpc';
import { FormButton } from '@components/ui/FormButton';
import Link from 'next/link';
import { Spinner } from '@components/ui/Spinner';

const Rewards: NextPageWithLayout = () => {
	const session = useHydratedSession();
	const { isLoading, userInfo } = useUserInfoCheck(session.user.id);

	const { data: pts, isLoading: isLoadingPoints } = trpc.useQuery([
		'user.getPoints',
		{ userId: session.user.id },
	]);

	const { data: team, isLoading: isLoadingTeam } = trpc.useQuery([
		'user.getTeam',
		{ userId: session.user.id },
	]);

	const { data: cats, isLoading: isLoadingCats } = trpc.useQuery([
		'rewards.getCats',
	]);

	const { data: rewards, isLoading: isLoadingRewards } = trpc.useQuery([
		'rewards.getRewards',
		{ teamId: team?.teamId! },
	]);

	const claimRewardMutation = trpc.useMutation(['rewards.claimReward']);

	const handleClaimReward = (id: string, points: number) => {
		console.log('claim reward');
	};

	if (!isLoading && userInfo.hasEmail === false) {
		displayToast();
	}

	function handleAdd() {
		return Router.push('/rewards/add');
	}
	console.log('test', isLoadingRewards);
	if (isLoadingTeam || isLoadingCats || isLoadingRewards) return <Spinner />;

	if (!isLoadingTeam && team?.teamId === null) {
		return (
			<div className="flex flex-col items-center">
				<div className="max-w-2xl w-full my-10">
					<p>
						User is not part of a team. Please either accept an invite or
						invite someone to your household
					</p>

					<Link href="/profile/invites">
						<button className="mt-10 bg-green rounded-3xl shadow-md text-white py-2 px-10 text-xl">
							Invite
						</button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center">
			<RewardHeader
				title="Time to get into Some fun!"
				buttonType="temp"
				buttonCallback={handleAdd}
			/>

			<div className="flex justify-center w-full max-w-5xl">
				<Image
					src="/images/reward.png"
					width={161}
					height={162}
					alt="It reward time!"
				/>
			</div>
			<div className="text-3xl my-6">
				{!isLoadingPoints && <p>Balance: {pts?.points} points</p>}
			</div>

			<div className="flex justify-center w-full max-w-5xl">
				{!isLoadingRewards && rewards && rewards?.length > 0 ? (
					<ul className="w-full px-2">
						{rewards?.map(reward => {
							return (
								<li key={reward.id} className="mb-4">
									<div className="border-[1px] border-y-grey-100 rounded-2xl flex flex-row items-center w-full py-2 px-4">
										<div className="mr-2">
											<Image
												src={`/images/categories/${
													cats?.filter(
														cat => cat.id === reward.categoryId
													)[0]!.image
												}`}
												width={50}
												height={50}
												alt={reward.title}
											/>
										</div>
										<div className="grow flex flex-col items-start w-full">
											<p className="">{reward.title}</p>
											<p className="font-inter">
												Required: {reward.points} points
											</p>
										</div>
										<div>
											<button className="bg-green rounded-3xl py-2 px-4 text-white">
												Claim
											</button>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				) : (
					'No rewards available'
				)}
			</div>
		</div>
	);
};

Rewards.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<>
			<Layout>{page}</Layout>
		</>
	);
};

export default Rewards;

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
