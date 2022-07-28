import { CheckmarkIcon } from '@components/icons';
import { useHydratedSession } from '@utils/customHooks';
import { trpc } from '@utils/trpc';

interface TaskItem {
	id: string;
	name: string;
	points: number;
	completed: boolean;
}

export const TaskItem = ({ id, name, points, completed }: TaskItem) => {
	const session = useHydratedSession();
	const utils = trpc.useContext();

	const completeTask = trpc.useMutation(['tasks.completeTask'], {
		onSuccess() {
			utils.invalidateQueries([
				'tasks.getAllTasks',
				{ userId: session.user.id },
			]);
		},
	});

	const uncompleteTask = trpc.useMutation('tasks.uncompleteTask', {
		onSuccess() {
			utils.invalidateQueries([
				'tasks.getAllTasks',
				{ userId: session.user.id },
			]);
		},
	});

	const handleCompleteTask = (e: any) => {
		e.preventDefault();
		completeTask.mutate({ taskId: id });
	};

	const handleUncompleteTask = (e: any) => {
		e.preventDefault();
		uncompleteTask.mutate({ taskId: id });
	};

	if (completed) {
		return (
			<li
				className="flex flex-row items-center py-2 border-[1px] border-grey-300"
				key={id}
			>
				<form onSubmit={e => handleUncompleteTask(e)}>
					<button className="m-1  bg-green rounded-full p-1" type="submit">
						<CheckmarkIcon className="h-5 w-auto text-white" />
					</button>
				</form>
				<span className="grow ml-4">{name}</span>
				<span className="w-16">{points} pts</span>
			</li>
		);
	}

	return (
		<li
			className="flex flex-row items-center py-2 border-[1px] border-grey-300"
			key={id}
		>
			<form onSubmit={e => handleCompleteTask(e)}>
				<button
					className="m-1  border-2 border-grey-700 h-6 w-6 rounded-full p-1"
					type="submit"
				>
					{/* <CheckmarkIcon className="h-5 w-auto text-white" /> */}
				</button>
			</form>
			<span className="grow ml-4">{name}</span>
			<span className="w-16">{points} pts</span>
		</li>
	);
};
