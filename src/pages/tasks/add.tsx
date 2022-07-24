import { useHydratedSession } from '../../utils/useHydratedSession';
import Layout from '../../components/ui/layout';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';

const AddTask: NextPageWithLayout = () => {
	const session = useHydratedSession();

	return (
		<>
			<h1>Add Tasks</h1>
		</>
	);
};

AddTask.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<>
			<Layout>{page}</Layout>
		</>
	);
};

export default AddTask;

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
