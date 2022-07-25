import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const userRouter = createRouter()
	.middleware(async ({ ctx, next }) => {
		// Any queries or mutations after this middleware will
		// raise an error unless there is a current session
		if (!ctx.session) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next();
	})
	.query('userInfo', {
		input: z.object({
			userId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.user.findUnique({
				where: {
					id: input.userId,
				},
			});
		},
	});
