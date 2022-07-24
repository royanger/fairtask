import { PlusIcon } from '../icons';

interface TasksHeader {
	title: string;
	buttonType: string;
	buttonCallback: Function;
}

export default function TasksHeader({
	title,
	buttonType,
	buttonCallback,
}: TasksHeader) {
	return (
		<>
			<div className=" flex items-center justify-center p-2">
				<div className="">
					<h1 className="text-3xl font-bold leading-[45px]">{title}</h1>
				</div>
				<div className="absolute  top-0 right-0 p-2 ">
					<button
						className="bg-green border-0 rounded-full p-2"
						onClick={() => buttonCallback()}
					>
						<PlusIcon className="text-white w-5 h-5" />
					</button>
				</div>
			</div>
		</>
	);
}
