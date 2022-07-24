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
			userId: z.string(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.task.findMany({
				where: {
					userId: input.userId,
				},
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
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.task.create({
				data: {
					userId: input.userId,
					name: input.title,
					description: input.description,
					value: input.value,
					due: input.date,
					teamId: input.teamId,
				},
			});
		},
	});
