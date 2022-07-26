import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';

// import components and utils
import { useHydratedSession, useUserInfoCheck } from '@utils/customHooks';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';
import Layout from '@components/ui/layout';
import Link from 'next/link';

const EmailRequired: NextPageWithLayout = () => {
	const session = useHydratedSession();

	return (
		<>
			<div className="p-4">
				<h1 className="text-xl  font-poppins">Email Required</h1>
				<div className="border-[1px] border-grey-100 mt-10 mb-12 p-4 shadow-md">
					<p>
						In order to receive invitations, you will need to enter your
						email address first.
					</p>

					<div className="flex items-center justify-center">
						<Link href="/profile/edit">
							<button className="bg-green py-2 px-8 shadow-md rounded-3xl text-white text-sm mt-10">
								Add Email
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

EmailRequired.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<>
			<Layout>{page}</Layout>
		</>
	);
};

export default EmailRequired;

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
