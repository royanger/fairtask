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
import Link from 'next/link';

const Tasks: NextPageWithLayout = () => {
	const [selectedMember, setSelectedMember] = React.useState('both');
	const session = useHydratedSession();
	const { isLoading, userInfo } = useUserInfoCheck(session.user.id);

	if (!isLoading && userInfo.hasEmail === false) {
		displayToast();
	}

	const { data: userTeam, isLoading: isLoadingTeam } = trpc.useQuery([
		'user.getTeam',
		{ userId: session.user.id },
	]);

	const { data: tasks, isLoading: isLoadingTasks } = trpc.useQuery([
		'tasks.getAllTasks',
		{
			teamId: userTeam?.teamId!,
		},
	]);

	// using a callback function here so that child component can be reused
	// when adding a task
	function handleAdd() {
		return Router.push('/tasks/add');
	}

	if (isLoadingTeam || isLoadingTasks) return null;

	if (!isLoadingTeam && userTeam?.teamId === null) {
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
		<div className="min-h-screen flex flex-col items-center">
			<div className="flex flex-col items-center max-w-5xl w-full">
				<div className="w-full">
					<TasksHeader
						title="Tasks"
						buttonType="add"
						buttonCallback={handleAdd}
					/>
				</div>
				<div className="px-4 w-full">
					<TeamSelector
						selectedMember={selectedMember}
						setSelectedMember={setSelectedMember}
					/>
				</div>
				<div className="mt-6 w-full">
					<h2
						className={`${
							tasks?.length === 0 ? 'bg-green-200' : 'bg-green-400'
						} text-white text-3xl leading p-10 py-2 shadow-md`}
					>
						{`

                  ${
							selectedMember === 'both'
								? tasks?.filter(task => task.completed === false)
										.length === 0
									? '0 Tasks in Queue'
									: 'To-Do'
								: tasks
										?.filter(
											task => task.assignedId === selectedMember
										)
										.filter(task => task.completed === false)
										.length === 0
								? '0 Tasks in Queue'
								: 'To-Do'
						}`}
					</h2>
				</div>
				<div className="w-full">
					<ul>
						{selectedMember === 'both'
							? tasks?.map(task => {
									return (
										<TaskItem
											key={task.id}
											id={task.id}
											name={task.name}
											points={task.value}
											completed={task.completed}
										/>
									);
							  })
							: tasks
									?.filter(task => task.assignedId === selectedMember)
									.map(task => {
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
