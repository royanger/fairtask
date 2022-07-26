import * as React from 'react';
import { useHydratedSession, useUserInfoCheck } from '@utils/customHooks';
import Layout from '@components/ui/layout';
import { NextPageWithLayout } from '../_app';
import { authOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession as getServerSession } from 'next-auth';
import { GetServerSideProps } from 'next';
import { useForm } from 'react-hook-form';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';

import {
	AssignIcon,
	CalendarIcon,
	MinusIcon,
	PlusIcon,
	StarIcon,
} from '@components/icons';
import { trpc } from '@utils/trpc';
import { displayToast } from '@utils/displayToast';

interface FormData {
	title: string;
	description: string;
}

const AddTask: NextPageWithLayout = () => {
	const session = useHydratedSession();
	const [selectedDate, setSelectedDate] = React.useState<Date>();
	const [value, setValue] = React.useState(0);
	const { isLoading, userInfo } = useUserInfoCheck(session.user.id);

	if (!isLoading && userInfo.hasEmail === false) {
		displayToast();
	}

	const addTaskMutation = trpc.useMutation(['tasks.addTask']);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>();

	const onSubmit = handleSubmit(data => {
		console.log('form data', data, value);

		addTaskMutation.mutate({
			userId: session.user.id,
			title: data.title,
			description: data.description,
			value: value,
			date: selectedDate,
			teamId: 'cl5xfr1ew011440wjzinpcuj9',
		});
	});

	let footer = 'Please select a date';
	if (selectedDate) {
		footer = `You picked ${format(selectedDate, 'PP')}`;
	}

	let formattedDate = 'DD/MM/YY';
	if (selectedDate) formattedDate = format(selectedDate, 'ee/LL/yy');

	const handleValueChange = (type: 'increment' | 'decrement') => {
		if (type === 'decrement' && value === 0) {
			// error that you can not decrease below 0
			return;
		}

		if (type === 'increment') setValue(value + 5);
		if (type === 'decrement') setValue(value - 5);
	};

	return (
		<>
			<h1>Add Tasks</h1>

			<form onSubmit={onSubmit} className="">
				<div className="border-[1px] border-grey-100 p-2 flex flex-col">
					<div className="flex flex-row">
						<label htmlFor="title">Title</label>
						<input
							{...register('title', { required: true })}
							className="border-[1px] border-grey-700 "
						/>
					</div>

					<div className="flex flex-row">
						<label htmlFor="description">Description</label>
						<input
							{...register('description', { required: true })}
							className="border-[1px] border-grey-700 "
						/>
					</div>
				</div>
				<div className="border-[1px] border-grey-100 p-2 flex flex-row">
					<AssignIcon className="h-4 w-auto" />
					<div className="">Assign:</div>
				</div>

				<div className="border-[1px] border-grey-100 p-2 flex flex-row">
					<StarIcon className="h-4 w-auto" />
					<div className="">Value:</div>
					<div className="border-[1px] border-grey-700 px-4">{value}</div>
					<button
						type="button"
						onClick={() => handleValueChange('increment')}
					>
						<PlusIcon className="h-4 w-auto" />
					</button>
					<button
						type="button"
						onClick={() => handleValueChange('decrement')}
					>
						<MinusIcon className="h-4 w-auto" />
					</button>
				</div>

				<div className="border-[1px] border-grey-100 p-2 flex flex-row">
					<CalendarIcon className="h-4 w-auto" />
					<div className="">
						Due:
						{formattedDate}
						<DayPicker
							mode="single"
							selected={selectedDate}
							onSelect={setSelectedDate}
							footer={footer}
						/>
					</div>
				</div>

				<button type="submit">Submit</button>
			</form>
		</>
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
