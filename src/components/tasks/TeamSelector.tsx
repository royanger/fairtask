import { UserIcon } from '@components/icons';
import { useHydratedSession } from '@utils/customHooks';
import { trpc } from '@utils/trpc';
import Image from 'next/image';
import { Controller, useForm } from 'react-hook-form';

interface TeamSelector {
	selectedMember: string | null;
	setSelectedMember: Function;
}

export const TeamSelector = ({
	selectedMember,
	setSelectedMember,
}: TeamSelector) => {
	const session = useHydratedSession();

	const handleChange = (id: string) => {
		console.log('working?', id);
		setSelectedMember(id);
	};

	const { data: team, isLoading } = trpc.useQuery([
		'team.getTeam',
		{ userId: session.user.id },
	]);

	if (isLoading) return null;

	if (!team) return <div>No team exists</div>;

	return (
		<div className="">
			<h2 className="text-poppins text-xl underline mt-6 mb-4">
				Filter by Household Member
			</h2>
			<div className="grid grid-cols-4 md:grid-cols-6">
				{team.map(member => {
					return (
						<div
							className="flex items-center justify-center "
							key={member.id}
							onClick={() => handleChange(member.id)}
						>
							<div
								className={`border-4  h-[76px] w-[76px]  rounded-full ${
									member.id === selectedMember
										? 'border-pink'
										: 'border-transparent'
								}`}
							>
								{member.image && member.name ? (
									<Image
										src={member?.image}
										alt={`${member.name}'s Profile Image`}
										width={72}
										height={72}
										className="rounded-full "
									/>
								) : (
									<div className="border-[1px] border-grey-700 rounded-full h-[72px] w-[72px] flex items-center justify-center">
										<UserIcon className="h-12 w-auto" />
									</div>
								)}
							</div>
						</div>
					);
				})}
				<div className="flex items-center justify-center">
					<div
						className={`flex flex-col items-center justify-center border-4  h-[76px] w-[76px]  rounded-full ${
							selectedMember === 'both'
								? 'border-pink'
								: 'border-transparent'
						}`}
						onClick={() => handleChange('both')}
					>
						<Image
							src="/images/fairtaskapp-with-whitespace.png"
							alt="both"
							width={72}
							height={72}
							className="rounded-full bg-green"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
