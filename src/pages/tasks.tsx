import * as React from 'react';
import { NextPageWithLayout } from './_app';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { trpc } from '@utils/trpc';
import { useHydratedSession, useUserInfoCheck } from '@utils/customHooks';
import { displayToast } from '@utils/displayToast';

// import components
import MobileMenu from '@components/menus/MobileMenu';
import TasksHeader from '@components/tasks/TasksHeader';
import { TeamSelector } from '@components/tasks/TeamSelector';
import Layout from '@components/ui/layout';
import { TaskItem } from '@components/tasks/TaskItem';

const Tasks: NextPageWithLayout = () => {
	const [selectedMember, setSelectedMember] = React.useState(null);
	const session = useHydratedSession();
	const { isLoading, userInfo } = useUserInfoCheck(session.user.id);

	if (!isLoading && userInfo.hasEmail === false) {
		displayToast();
	}

	// TODO this needs to be updated by the household member selection, for
	// task filtering
	const { data: tasks } = trpc.useQuery([
		'tasks.getAllTasks',
		{
			userId: session.user.id,
			assigned: selectedMember !== 'both' ? selectedMember : null,
		},
	]);

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
			<div className="px-4">
				<TeamSelector
					selectedMember={selectedMember}
					setSelectedMember={setSelectedMember}
				/>
			</div>
			<div className="mt-6">
				<h2 className="bg-green-400 text-white text-3xl leading p-10 py-2">
					To-Do
				</h2>
			</div>
			<div>
				<ul>
					{tasks?.map(task => {
						return (
							<TaskItem
								key={task.id}
								id={task.id}
								name={task.name}
								points={task.value}
								completed={task.completed}
							/>
						);
					})}
				</ul>
			</div>

			<MobileMenu />
		</div>
	);
};

Tasks.getLayout = function getLayout(page: React.ReactElement) {
	return <Layout>{page}</Layout>;
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
