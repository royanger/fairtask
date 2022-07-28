import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const tasksRouter = createRouter()
	.middleware(async ({ ctx, next }) => {
		// Any queries or mutations after this middleware will
		// raise an error unless there is a current session
		if (!ctx.session) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next();
	})
	.query('hello', {
		input: z
			.object({
				text: z.string().nullish(),
			})
			.nullish(),
		resolve({ input }) {
			return {
				greeting: `Hello ${input?.text ?? 'world'}`,
			};
		},
	})

	.query('getAllTasks', {
		input: z.object({
			userId: z.string().cuid(),
			assigned: z.string().cuid().nullish(),
		}),
		async resolve({ input, ctx }) {
			console.log('assigned', input.assigned);
			const assignedId =
				input.assigned !== null
					? [{ userId: input.userId }, { assignedId: input.assigned }]
					: [{ userId: input.userId }];
			return await ctx.prisma.task.findMany({
				where: {
					AND: assignedId,
				},
				orderBy: [
					{
						completed: 'asc',
					},
					{
						name: 'desc',
					},
				],
			});
		},
	})
	.mutation('addTask', {
		input: z.object({
			userId: z.string(),
			title: z.string(),
			description: z.string(),
			teamId: z.string(),
			value: z.number(),
			date: z.date(),
			assigned: z.string().cuid().nullish(),
		}),
		async resolve({ input, ctx }) {
			console.log('input', input);
			return await ctx.prisma.task.create({
				data: {
					userId: input.userId,
					name: input.title,
					description: input.description,
					value: input.value,
					due: input.date,
					teamId: input.teamId,
					assignedId: input.assigned,
				},
			});
		},
	})
	.mutation('completeTask', {
		input: z.object({
			taskId: z.string().cuid(),
		}),

		async resolve({ input, ctx }) {
			return await ctx.prisma.task.update({
				where: {
					id: input.taskId,
				},
				data: {
					completed: true,
				},
			});
		},
	})
	.mutation('uncompleteTask', {
		input: z.object({
			taskId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			console.log('removing complete status');

			return await ctx.prisma.task.update({
				where: {
					id: input.taskId,
				},
				data: {
					completed: false,
				},
			});
		},
	});
