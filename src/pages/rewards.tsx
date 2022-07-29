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

const Rewards: NextPageWithLayout = () => {
	const session = useHydratedSession();
	const { isLoading, userInfo } = useUserInfoCheck(session.user.id);

	// const createCatMutation = trpc.useMutation(['cats.createCat']);

	// const handleClick = () => {
	// 	createCatMutation.mutate({
	// 		name: 'Wildcard',
	// 		image: 'wildcard.png',
	// 	});
	// };

	if (!isLoading && userInfo.hasEmail === false) {
		displayToast();
	}

	function handleAdd() {
		return Router.push('/rewards/add');
	}

	return (
		<>
			<RewardHeader
				title="Time to get into Some fun!"
				buttonType="temp"
				buttonCallback={handleAdd}
			/>

			<div className="flex justify-center">
				<Image
					src="/images/reward.png"
					width={161}
					height={162}
					alt="It reward time!"
				/>
			</div>
		</>
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
