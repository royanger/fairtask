import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const inviteRouter = createRouter()
	.middleware(async ({ ctx, next }) => {
		// Any queries or mutations after this middleware will
		// raise an error unless there is a current session
		if (!ctx.session) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next();
	})
	.query('getInvites', {
		input: z.object({
			email: z.string().email().nullish(),
		}),
		async resolve({ input, ctx }) {
			if (!input.email) {
				return null;
			}
			return ctx.prisma.invites.findMany({
				where: {
					email: input.email,
				},
				include: {
					user: true,
				},
			});
		},
	})
	.mutation('acceptInvite', {
		input: z.object({
			userId: z.string().cuid(),
			inviteId: z.string().cuid(),
			teamId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			await ctx.prisma.user.update({
				where: {
					id: input.userId,
				},
				data: {
					teamId: input.teamId,
				},
			});

			await ctx.prisma.invites.delete({
				where: {
					id: input.inviteId,
				},
			});
		},
	})
	.mutation('declineInvite', {
		input: z.object({
			inviteId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			await ctx.prisma.invites.delete({
				where: {
					id: input.inviteId,
				},
			});
		},
	});
