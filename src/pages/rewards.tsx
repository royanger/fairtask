import { useSession, signIn, signOut } from 'next-auth/react';
import Layout from '../components/ui/layout';
import { NextPageWithLayout } from './_app';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';

const Rewards: NextPageWithLayout = () => {
	const { data: session, status } = useSession();

	return (
		<>
			<h1>Rewards</h1>
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
