import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const teamRouter = createRouter()
	.middleware(async ({ ctx, next }) => {
		// Any queries or mutations after this middleware will
		// raise an error unless there is a current session
		if (!ctx.session) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next();
	})
	.query('getTeam', {
		input: z.object({
			userId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			const data = await ctx.prisma.user.findUnique({
				where: {
					id: input.userId,
				},
				select: {
					teamId: true,
				},
			});

			if (!data?.teamId) return null;
			return await ctx.prisma.user.findMany({
				where: {
					teamId: data.teamId,
				},
			});
		},
	})
	.mutation('createTeam', {
		input: z.object({
			userId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			const results = await ctx.prisma.team.create({
				data: {
					creator: input.userId,
				},
			});
			return await ctx.prisma.user.update({
				where: {
					id: input.userId,
				},
				data: {
					teamId: results.id,
				},
			});
		},
	});
