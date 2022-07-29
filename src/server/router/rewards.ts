import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

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
	});
