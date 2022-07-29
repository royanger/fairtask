import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createNextApiHandler } from '@trpc/server/adapters/next';

export const rewardsRouter = createRouter()
	.middleware(async ({ ctx, next }) => {
		// Any queries or mutations after this middleware will
		// raise an error unless there is a current session
		if (!ctx.session) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next();
	})
	.query('getCats', {
		async resolve({ ctx }) {
			return ctx.prisma.rewardCategory.findMany({});
		},
	})
	.query('getRewards', {
		input: z.object({
			teamId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			return ctx.prisma.reward.findMany({
				where: {
					AND: [
						{
							teamId: input.teamId,
						},
						{ claimed: false },
					],
				},
			});
		},
	})
	.query('getClaimedRewards', {
		input: z.object({
			userId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			return ctx.prisma.reward.findMany({
				where: {
					claimedById: input.userId,
				},
			});
		},
	})
	.mutation('createReward', {
		input: z.object({
			title: z.string(),
			points: z.number(),
			categoryId: z.string().cuid(),
			teamId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			return ctx.prisma.reward.create({
				data: {
					title: input.title,
					points: input.points,
					categoryId: input.categoryId,
					teamId: input.teamId,
				},
			});
		},
	})
	.mutation('claimReward', {
		input: z.object({
			rewardId: z.string().cuid(),
			userId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.reward.update({
				where: {
					id: input.rewardId,
				},
				data: {
					claimed: true,
					claimedById: input.userId,
				},
			});
		},
	});
