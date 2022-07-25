import { NextPageWithLayout } from './_app';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { trpc } from '@utils/trpc';
import { useHydratedSession, useUserInfoCheck } from '@utils/customHooks';
// import components
import MobileMenu from '@components/menus/MobileMenu';
import TasksHeader from '@components/tasks/TasksHeader';
import TeamSelector from '@components/tasks/TeamSelector';
import Layout from '@components/ui/layout';
import { CheckmarkIcon } from '@components/icons';

const Tasks: NextPageWithLayout = () => {
	const session = useHydratedSession();

	const { data: tasks } = trpc.useQuery([
		'tasks.getAllTasks',
		{ userId: session.user.id },
	]);

	if (tasks) {
		console.log('tasks', tasks);
	}
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
			<div>
				<h2 className="bg-green-400 text-white text-3xl leading p-10 py-2">
					To-Do
				</h2>
			</div>
			<div>
				<ul>
					{tasks?.map(task => {
						return (
							<li
								className="flex flex-row items-center py-2 border-[1px] border-grey-300"
								key={task.id}
							>
								<button className="m-1  bg-green rounded-full p-1">
									<CheckmarkIcon className="h-5 w-auto text-white" />
								</button>
								<span className="grow ml-4">{task.name}</span>
								<span className="w-16">{task.value} pts</span>
							</li>
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
