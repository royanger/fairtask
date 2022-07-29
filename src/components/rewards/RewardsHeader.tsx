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
			<div className="flex flex-col items-center w-full">
				<div className="flex items-center justify-center p-2 md:max-w-5xl w-full">
					<div className="relative w-full">
						<div className="flex flex-row justify-start">
							<h1 className="text-xl font-bold leading-[45px]">
								{title}
							</h1>
						</div>
						<div className="absolute top-0 right-0 p-2">
							<button
								className="bg-green border-0 rounded-full p-2"
								onClick={() => buttonCallback()}
							>
								{buttonType === 'link' ? (
									'Save'
								) : (
									<PlusIcon className="text-white w-5 h-5" />
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
