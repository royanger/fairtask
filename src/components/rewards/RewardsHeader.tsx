import { PlusIcon } from '../icons';

interface RewardHeader {
	title: string;
	buttonType: string;
	buttonCallback: Function;
}

export default function RewardHeader({
	title,
	buttonType,
	buttonCallback,
}: RewardHeader) {
	return (
		<>
			<div className=" flex items-center justify-start p-2">
				<div className="">
					<h1 className="text-xl font-bold leading-[45px]">{title}</h1>
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
