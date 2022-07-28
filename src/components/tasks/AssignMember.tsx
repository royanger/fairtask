import { AssignIcon, UserIcon } from '@components/icons';
import { useHydratedSession } from '@utils/customHooks';
import { trpc } from '@utils/trpc';
import Image from 'next/image';

interface AssignMember {
	register: Function;
}

export const AssignMember = ({ register }: AssignMember) => {
	const session = useHydratedSession();
	const { data: team, isLoading } = trpc.useQuery([
		'team.getTeam',
		{ userId: session.user.id },
	]);

	if (isLoading) return null;
	if (!isLoading && (!team || team.length < 1)) return null;

	return (
		<div className="border-[1px] border-grey-100 py-4 px-3 flex flex-row rounded-3xl mb-4">
			<div className="flex flex-row items-start mt-5">
				<AssignIcon className="h-5 w-auto mr-2" />
				<div className="">Assign:</div>
			</div>
			<div className="grow grid grid-cols-3 md:grid-cols-6 gap-2 gap-y-6">
				{team?.map(member => {
					return (
						<label
							key={member.id}
							className="flex flex-col items-center justify-center"
						>
							<input
								type="radio"
								{...register('assignedMember', { required: true })}
								id={member.id}
								value={member.id}
							/>
							{member.image && member.name ? (
								<Image
									src={member?.image}
									alt={`${member.name}'s Profile Image`}
									width={72}
									height={72}
									className="rounded-full"
								/>
							) : (
								<div className="border-[1px] border-grey-700 rounded-full h-[72px] w-[72px] flex items-center justify-center">
									<UserIcon className="h-12 w-auto" />
								</div>
							)}
						</label>
					);
				})}
				<label className="flex flex-col items-center justify-center">
					<input
						type="radio"
						{...register('assignedMember', { required: true })}
						id="both"
						value="both"
					/>

					<Image
						src="/images/fairtaskapp-with-whitespace.png"
						alt="both"
						width={72}
						height={72}
						className="rounded-full bg-green"
					/>
				</label>
			</div>
		</div>
	);
};
