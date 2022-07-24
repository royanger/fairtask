import Layout from '../../components/ui/layout';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import { useHydratedSession } from '../../utils/useHydratedSession';

const AddRewards: NextPageWithLayout = () => {
	const session = useHydratedSession();

	return (
		<>
			<h1>Add Rewards</h1>
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
