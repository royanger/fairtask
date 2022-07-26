import { PlusIcon } from '@components/icons';
import { useHydratedSession } from '@utils/customHooks';
import { trpc } from '@utils/trpc';
import Image from 'next/image';
import Link from 'next/link';

export const HouseholdMembers = () => {
	const session = useHydratedSession();

	const { data: team, isLoading } = trpc.useQuery([
		'team.getTeam',
		{ userId: session.user.id },
	]);

	if (isLoading) return null;

	if (!team) return <div>No team exists</div>;

	return (
		<div className="">
			<h2 className="text-poppins text-xl underline mt-12 mb-4">
				Household Members
			</h2>
			<div className="grid grid-cols-4">
				{team.map(member => {
					return (
						<div
							className="flex items-center justify-center"
							key={member.id}
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
								'no image'
							)}
						</div>
					);
				})}
			</div>
			<div>
				<Link href="/profile/add">
					<button className="w-20 h-20  flex items-center justify-center">
						<PlusIcon className="text-green h-10 w-auto" />
					</button>
				</Link>
			</div>
		</div>
	);
};
