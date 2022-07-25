import { CheckmarkIcon, StarIcon } from '@components/icons';

interface LargeButton {
	icon: 'star' | 'checkmark';
	children: React.ReactNode;
}

export const ProfileButton = ({ icon, children }: LargeButton) => {
	return (
		<button className="border-[1px] border-grey-100 py-8 flex items-center justify-center shadow-md rounded-lg">
			{icon === 'checkmark' && (
				<span className="bg-grey-300 rounded-full p-2 mr-2">
					<CheckmarkIcon className="h-6 w-auto text-white" />
				</span>
			)}
			{icon === 'star' && (
				<StarIcon className="h-6 w-auto text-yellow-500 mr-2" />
			)}

			{children}
		</button>
	);
};
