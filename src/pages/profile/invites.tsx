import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';

// import components and utils
import { useHydratedEmailSession } from '@utils/customHooks';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';
import Layout from '@components/ui/layout';
import { trpc } from '@utils/trpc';
import Image from 'next/image';
import Router from 'next/router';

const AddHouseholdMember: NextPageWithLayout = () => {
	const session = useHydratedEmailSession();
	const utils = trpc.useContext();

	const { data: invites } = trpc.useQuery([
		'invites.getInvites',
		{ email: session.user.email },
	]);

	const acceptInviteMutation = trpc.useMutation(['invites.acceptInvite']);

	function handleAcceptInvite(teamId: string, inviteId: string) {
		acceptInviteMutation.mutate(
			{
				userId: session.user.id,
				teamId: teamId,
				inviteId: inviteId,
			},
			{
				onSuccess: () => {
					Router.push('/profile');
				},
			}
		);
	}

	const declineInviteMutation = trpc.useMutation(['invites.declineInvite']);

	function handleDeclineInvite(inviteId: string) {
		declineInviteMutation.mutate(
			{
				inviteId: inviteId,
			},
			{
				onSuccess: () => {
					utils.invalidateQueries([
						'invites.getInvites',
						{ email: session.user.email },
					]);
				},
			}
		);
	}

	const DisplayInvites = () => {
		return (
			<div>
				{invites?.map(invite => {
					return (
						<div className="" key={invite.id}>
							<div className="grid grid-cols-4 grow ">
								<div className="flex items-center justify-center pt-7 col-span-2 ">
									<div className="flex flex-col items-center">
										<div className="border-2 border-grey rounded-full w-[74px] h-[74px]">
											{invite.user.image && (
												<Image
													src={invite.user.image}
													alt={`${invite.user.name}'s Profile Image`}
													width={72}
													height={72}
													className="rounded-full "
												/>
											)}
										</div>
										<div>
											<h2>{invite.user.name}</h2>
											<p>{invite.user.email}</p>
										</div>
									</div>
								</div>
								<div className="col-span-2 flex flex-col items-center justify-center">
									<button
										className="bg-green py-2 px-6 text-white text-sm rounded-3xl mb-2"
										onClick={() =>
											handleAcceptInvite(
												invite.user.teamId!,
												invite.id
											)
										}
									>
										Accept
									</button>
									<button
										className="bg-green py-2 px-6 text-white text-sm rounded-3xl mt-2"
										onClick={() => handleDeclineInvite(invite.id)}
									>
										Decline
									</button>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	};

	return (
		<>
			<div className="p-4 flex flex-col items-center">
				<div className="w-full max-w-5xl">
					<h1 className="text-xl  font-poppins">Pending Invitations</h1>
					<div className="border-[1px] border-grey-100 mt-10 mb-12 p-4 shadow-md">
						{invites && invites?.length > 0 ? (
							<DisplayInvites />
						) : (
							<div className="">There are no pending invites.</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

AddHouseholdMember.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<>
			<Layout>{page}</Layout>
		</>
	);
};

export default AddHouseholdMember;

export const getServerSideProps: GetServerSideProps = async context => {
	const session = await getServerSession(
		context.req,
		context.res,
		authOptions
	);

	if (!session) {
		return {
			redirect: {
				permanent: false,
				destination: `/login`,
			},
		};
	}
	if (!session.user?.email) {
		return {
			redirect: {
				permanent: false,
				destination: '/profile/email-required',
			},
		};
	}
	return {
		props: {
			session: session,
		},
	};
};
