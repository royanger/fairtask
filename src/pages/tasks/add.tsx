import * as React from 'react';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';

// add components and utils
import { useHydratedSession, useUserInfoCheck } from '@utils/customHooks';
import Layout from '@components/ui/layout';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';
import { CalendarIcon, MinusIcon, PlusIcon, StarIcon } from '@components/icons';
import { trpc } from '@utils/trpc';
import { displayToast } from '@utils/displayToast';
import TasksHeader from '@components/tasks/TasksHeader';
import { FormButton } from '@components/ui/FormButton';
import { AssignMember } from '@components/tasks/AssignMember';
import Router from 'next/router';

interface FormData {
	title: string;
	description: string;
	date: Date;
	value: number;
	assignedMember: string;
}

const AddTask: NextPageWithLayout = () => {
	const session = useHydratedSession();
	const { isLoading, userInfo } = useUserInfoCheck(session.user.id);

	if (!isLoading && userInfo.hasEmail === false) {
		displayToast();
	}

	const { data: team, isLoading: userTeamLoading } = trpc.useQuery([
		'user.getTeam',
		{ userId: session.user.id },
	]);
	const addTaskMutation = trpc.useMutation(['tasks.addTask'], {
		onSuccess: data => Router.push('/tasks'),
	});

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			value: 0,
		},
	});

	const onSubmit = handleSubmit(async data => {
		const assignedId =
			data.assignedMember === 'both' ? null : data.assignedMember;

		await addTaskMutation.mutate({
			userId: session.user.id,
			title: data.title,
			description: data.description,
			value: data.value,
			date: data.date,
			teamId: team?.teamId!,
			assigned: assignedId,
		});
	});

	const handleValueChange = (type: string) => {
		let newValue = 0;
		if (type === 'increment') newValue = watch('value') + 5;
		if (type === 'decrement') newValue = watch('value') - 5;
		setValue('value', newValue);
	};

	return (
		<div className="flex-col flex items-center">
			<TasksHeader
				title="Add Task"
				buttonType="link"
				buttonCallback={onSubmit}
			/>
			<div className="max-w-5xl w-full">
				<form onSubmit={onSubmit} className="px-2 ">
					<div className="border-[1px] border-grey-100 py-4 px-3 flex flex-col rounded-3xl mb-4">
						<div className="flex flex-row mb-4">
							<label htmlFor="title" className="mr-2">
								Title
							</label>
							<input
								{...register('title', { required: true })}
								className="bg-grey-50 w-full py-1 px-2 text-grey-900"
							/>
						</div>

						<div className="flex flex-row">
							<label htmlFor="description" className="mr-2">
								Description
							</label>
							<input
								{...register('description', { required: true })}
								className="bg-grey-50 w-full py-1 px-2 text-grey-900"
							/>
						</div>
					</div>
					<AssignMember register={register} />

					<div className="border-[1px] border-grey-100 py-4 px-3 flex flex-row items-center rounded-3xl mb-4">
						<StarIcon className="h-4 w-auto text-yellow-500 mr-2" />
						<div className="mr-4">Value:</div>

						<input
							{...register('value', {
								required: true,
								min: { value: 1, message: 'too low' },
								max: 99999999,
							})}
							type="number"
							className="bg-grey-50 w-20 text-center py-1 text-grey-900"
						/>
						<p>{errors.value?.message}</p>

						<button
							type="button"
							onClick={() => handleValueChange('increment')}
							className="bg-green border-0 rounded-full p-2 text-white ml-4"
						>
							<PlusIcon className="h-4 w-auto" />
						</button>
						<button
							type="button"
							onClick={() => handleValueChange('decrement')}
							className="bg-green border-0 rounded-full p-2 text-white ml-4"
						>
							<MinusIcon className="h-4 w-auto" />
						</button>
					</div>

					<div className="border-[1px] border-grey-100 py-4 px-3 flex flex-row items-center rounded-3xl mb-4">
						<div className="h-5">
							<CalendarIcon className="h-5 w-auto mr-2" />
						</div>
						<label htmlFor="date" className="mr-4">
							{' '}
							Due:
						</label>
						<Controller
							control={control}
							name="date"
							render={({ field }) => (
								<DatePicker
									placeholderText="Select date"
									onChange={date => field.onChange(date)}
									selected={field.value}
									required={true}
								/>
							)}
						/>
					</div>
					<div className="flex items-center justify-center">
						<FormButton>Submit</FormButton>
					</div>
				</form>
				<div
					className={`${
						Object.keys(errors).length > 0
							? ' border-red-500'
							: 'border-transparent'
					} border-2 rounded-xl py-4 px-6 mt-10`}
				>
					{Object.keys(errors).length > 0 && (
						<>
							<h3 className="font-bold text-xl">
								Please correct the following errors:
							</h3>
							<ul>
								{errors.title && <li className="my-2">Set a title</li>}
								{errors.title && (
									<li className="my-2">Enter a description</li>
								)}
								{errors.title && (
									<li className="my-2">Enter a value</li>
								)}
								{errors.title && (
									<li className="my-2">
										Select whom the task is assigned to
									</li>
								)}
							</ul>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

AddTask.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<>
			<Layout>{page}</Layout>
		</>
	);
};

export default AddTask;

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
