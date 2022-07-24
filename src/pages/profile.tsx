import { useHydratedSession } from '../utils/useHydratedSession';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { EditIcon, LogoutIcon } from '../components/icons';
import Layout from '../components/ui/layout';
import { NextPageWithLayout } from './_app';
import { authOptions } from './api/auth/[...nextauth]';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';

const Profile: NextPageWithLayout = () => {
	const session = useHydratedSession();



	// if (allUsers) {
	// 	console.log(allUsers);
	// }



	// console.log(session);
	return (
		<div className="p-4">
			<h1 className="text-xl  font-poppins">Your Account</h1>
			<div className="flex items-center justify-center pt-7">
				<div className="border-2 border-grey rounded-full w-[74px] h-[74px]">
					{session?.user?.image ? (
						<Image
							src={session.user.image}
							alt={`${session.user.name}'s Profile Image`}
							width={72}
							height={72}
							className="rounded-full "
						/>
					) : (
						''
					)}
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
							<LogoutIcon className="h-5 w-auto text-blue-700" />
						</span>
						Logout
					</button>
				</div>
			</div>
			<div>
				<h3 className="font-poppins">Add Mate or Partner</h3>
				<p>Add a mate, partner or roommate so you can share tasks</p>
			</div>
		</div>
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
