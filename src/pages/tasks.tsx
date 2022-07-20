import { useSession } from 'next-auth/react';
import Router from 'next/router';
import MobileMenu from '../components/menus/MobileMenu';
import TasksHeader from '../components/tasks/TasksHeader';
import TeamSelector from '../components/tasks/TeamSelector';

export default function Tasks() {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return (
			<>
				<p>loading</p>
			</>
		);
	}

	if (!session) {
		return Router.push('/login');
	}

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
}
