import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

// import components and utils
import { useHydratedSession, useUserInfoCheck } from '@utils/customHooks';
import { NextPageWithLayout } from './_app';
import { authOptions } from './api/auth/[...nextauth]';
import { EditIcon, LogoutIcon, PlusIcon } from '@components/icons';
import Layout from '@components/ui/layout';
import { ProfileButton } from '@components/ui/ProfileButton';
import { displayToast } from '@utils/displayToast';
import { trpc } from '@utils/trpc';
import { ImportNotification } from '@components/profile/InviteNotification';
import { HouseholdMembers } from '@components/profile/HouseholdMembers';

const Profile: NextPageWithLayout = () => {
	const session = useHydratedSession();
	const { isLoading, userInfo } = useUserInfoCheck(session.user.id);

	if (!isLoading && userInfo.hasEmail === false) {
		displayToast();
	}

	return (
		<>
			<div className="p-4">
				<h1 className="text-xl  font-poppins">Your Account</h1>
				<div className="relative">
					<div className="flex items-center justify-center pt-7 ">
						<div className="border-2 border-grey rounded-full w-[74px] h-[74px]">
							{session?.user?.image && (
								<Image
									src={session.user.image}
									alt={`${session.user.name}'s Profile Image`}
									width={72}
									height={72}
									className="rounded-full "
								/>
							)}
						</div>
						<div className="absolute top-3 translate-x-10">
							<Link href="/profile/edit">
								<div className="p-2 cursor-pointer">
									<EditIcon className="h-5 w-auto" />
								</div>
							</Link>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center mt-5">
					<h2 className="font-poppins text-xl">{session?.user?.name}</h2>
					<p className="text-sm text-grey-700 font-inter">
						{session?.user?.email}
					</p>
				</div>

				<div className="mt-12  border-b-[1px] border-grey-100">
					<div className="mb-2">
						<button
							className="flex flex-row items-center"
							onClick={() => signOut({ callbackUrl: '/' })}
						>
							<span className=" bg-grey-100 mr-4 p-2 rounded-full">
								<LogoutIcon className="h-5 w-auto text-green" />
							</span>
							Logout
						</button>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4 mt-4">
					<ProfileButton icon="checkmark">Add a Task</ProfileButton>
					<ProfileButton icon="star">Add a Reward</ProfileButton>
				</div>
				<ImportNotification />
				<HouseholdMembers />
			</div>
		</>
	);
};

Profile.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<>
			<Layout>{page}</Layout>
		</>
	);
};

export default Profile;

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
	return {
		props: {
			session: session,
		},
	};
};
