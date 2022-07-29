import { PlusIcon, UserIcon } from '@components/icons';
import { useHydratedSession } from '@utils/customHooks';
import { trpc } from '@utils/trpc';
import Image from 'next/image';
import Link from 'next/link';

interface HouseholdMembers {
	showAddMember?: boolean;
}

export const HouseholdMembers = ({
	showAddMember = true,
}: HouseholdMembers) => {
	const session = useHydratedSession();

	const { data: team, isLoading } = trpc.useQuery([
		'team.getTeam',
		{ userId: session.user.id },
	]);

	if (isLoading) return null;

	if (!team) {
		return (
			<div className="">
				<h2 className="text-poppins text-xl underline mt-6 mb-4">
					Household Members
				</h2>
				<div className="grid grid-cols-4 md:grid-cols-6">
					<div className="flex justify-center">
						<Link href="/profile/add">
							<button className="w-20 h-20  flex items-center justify-center">
								<PlusIcon className="text-green h-10 w-auto" />
							</button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="">
			<h2 className="text-poppins text-xl underline mt-6 mb-4">
				Household Members
			</h2>
			<div className="grid grid-cols-4 md:grid-cols-6">
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
								<div className="border-[1px] border-grey-700 rounded-full h-[72px] w-[72px] flex items-center justify-center">
									<UserIcon className="h-12 w-auto" />
								</div>
							)}
						</div>
					);
				})}
				{showAddMember && (
					<div className="flex justify-center">
						<Link href="/profile/add">
							<button className="w-20 h-20  flex items-center justify-center">
								<PlusIcon className="text-green h-10 w-auto" />
							</button>
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};
