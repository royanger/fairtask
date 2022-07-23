import { useSession } from 'next-auth/react';
import MobileMenu from '../components/menus/MobileMenu';
import TasksHeader from '../components/tasks/TasksHeader';
import TeamSelector from '../components/tasks/TeamSelector';
import Layout from '../components/ui/layout';
import { NextPageWithLayout } from './_app';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import Router from 'next/router';

const Tasks: NextPageWithLayout = () => {
	const { data: session, status } = useSession();

	// if the user doesn't have a name, email and image set redirect
	// to profile page to set those
	// if (!session?.user?.image || !session.user.email || !session.user.name) {
	// 	return Router.push('/profile');
	// }

	// using a callback function here so that child component can be reused
	// when adding a task
	function handleAdd() {
		return Router.push('/tasks/add');
	}

	return (
		<div className="min-h-screen">
			<div>
				<TasksHeader
					title="Tasks"
					buttonType="add"
					buttonCallback={handleAdd}
				/>
			</div>
			<div>
				<TeamSelector />
			</div>

			<MobileMenu />
		</div>
	);
};

Tasks.getLayout = function getLayout(page: React.ReactElement) {
	return <Layout>{page}</Layout>;
};

Tasks.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<>
			<Layout>{page}</Layout>
		</>
	);
};

export default Tasks;

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
