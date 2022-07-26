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
import { FormButton } from '@components/ui/FormButton';

const nameFormSchema = z.object({
	name: z.string().min(1),
});

type NameFormData = z.infer<typeof nameFormSchema>;

const emailFormSchema = z.object({
	email: z.string().email(),
});

type EmailFormData = z.infer<typeof emailFormSchema>;

const EditProfile: NextPageWithLayout = () => {
	const session = useHydratedSession();
	const updateNameMutation = trpc.useMutation(['user.updateName']);
	const updateEmailMutation = trpc.useMutation(['user.updateEmail']);

	const {
		register: registerName,
		handleSubmit: handleSubmitName,
		formState: {
			errors: errorsName,
			isSubmitSuccessful: isSubmitSuccessfulName,
		},
		setError: setErrorName,
	} = useForm<NameFormData>();

	const onSubmitName = handleSubmitName(data => {
		const validation = nameFormSchema.safeParse(data);
		if (validation.success) {
			updateNameMutation.mutate({
				userId: session.user.id,
				name: data.name,
			});
		} else {
			setErrorName('name', {
				type: 'custom',
				message: 'Please enter a valid name.',
			});
		}
	});

	const {
		register: registerEmail,
		handleSubmit: handleSubmitEmail,
		formState: {
			errors: errorsEmail,
			isSubmitSuccessful: isSubmitSuccessfulEmail,
		},
		setError: setErrorEmail,
	} = useForm<EmailFormData>();

	const onSubmitEmail = handleSubmitEmail(data => {
		const validation = emailFormSchema.safeParse(data);
		if (validation.success) {
			updateEmailMutation.mutate({
				userId: session.user.id,
				email: data.email,
			});
		} else {
			setErrorEmail('email', {
				type: 'custom',
				message: 'Please enter a valid email address.',
			});
		}
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
				<div className="border-[1px] border-grey-100 mt-10 mb-12 p-4 shadow-md">
					<form onSubmit={onSubmitName}>
						<div className=" p-2 flex flex-col">
							<div className="flex flex-row">
								<label htmlFor="title">Name</label>
								<input
									{...registerName('name', { required: true })}
									className="border-[1px] border-grey-700 "
								/>
							</div>
						</div>
						<div>
							<FormButton>Update Name</FormButton>
							{isSubmitSuccessfulName ? 'Name update' : ''}
						</div>
						<div>{errorsName.name && errorsName.name.message}</div>
					</form>
				</div>

				<div className="border-[1px] border-grey-100">
					<form onSubmit={onSubmitEmail}>
						<div className=" p-2 flex flex-col">
							<div className="flex flex-row">
								<label htmlFor="title">Email</label>
								<input
									{...registerEmail('email', { required: true })}
									className="border-[1px] border-grey-700 "
								/>
							</div>
						</div>
						<div>
							<FormButton>Update Email</FormButton>
							{isSubmitSuccessfulEmail ? 'Email updated' : ''}
						</div>
						<div>{errorsEmail.email && errorsEmail.email.message}</div>
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
