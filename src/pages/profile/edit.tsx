import Image from 'next/image';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// import components and utils
import { useHydratedSession, useUserInfoCheck } from '@utils/customHooks';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';
import Layout from '@components/ui/layout';
import { trpc } from '@utils/trpc';

interface FormData {
	email: string;
}

const EditProfile: NextPageWithLayout = () => {
	const session = useHydratedSession();
	const updateUserMutation = trpc.useMutation(['user.userEdit']);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = handleSubmit(data => {
		console.log('edit profile data', data);

		updateUserMutation.mutate({
			userId: session.user.id,
			email: data.email,
		});
	});

	return (
		<>
			<div className="p-4">
				<h1 className="text-xl  font-poppins">Edit Profile</h1>
				<div className="flex items-center justify-center pt-7 ">
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
				<div>
					<form onSubmit={onSubmit}>
						<div className="border-[1px] border-grey-100 p-2 flex flex-col">
							<div className="flex flex-row">
								<label htmlFor="title">Email</label>
								<input
									{...register('email', { required: true })}
									className="border-[1px] border-grey-700 "
								/>
							</div>
						</div>
						<div>
							<button type="submit">Save</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

EditProfile.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<>
			<Layout>{page}</Layout>
		</>
	);
};

export default EditProfile;

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
