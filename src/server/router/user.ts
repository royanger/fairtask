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
	})
	.query('getTeam', {
		input: z.object({
			userId: z.string().cuid(),
		}),
		async resolve({ input, ctx }) {
			return ctx.prisma.user.findUnique({
				where: {
					id: input.userId,
				},
				select: {
					team: true,
				},
			});
		},
	})
	.mutation('updateName', {
		input: z.object({
			userId: z.string().cuid(),
			name: z.string().min(1),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.user.update({
				where: {
					id: input.userId,
				},
				data: {
					name: input.name,
				},
			});
		},
	})
	.mutation('updateEmail', {
		input: z.object({
			userId: z.string().cuid(),
			email: z.string().email(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.user.update({
				where: {
					id: input.userId,
				},
				data: {
					email: input.email,
				},
			});
		},
	})
	.mutation('addHouseholdMember', {
		input: z.object({
			userId: z.string().cuid(),
			email: z.string().email(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.invites.create({
				data: {
					userId: input.userId,
					email: input.email,
				},
			});
		},
	});
