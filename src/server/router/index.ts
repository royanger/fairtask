// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { authRouter } from './auth';
import { tasksRouter } from './tasks';
import { teamRouter } from './team';
import { userRouter } from './user';
import { inviteRouter } from './invites';
import { rewardsRouter } from './rewards';

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('auth.', authRouter)
	.merge('tasks.', tasksRouter)
	.merge('team.', teamRouter)
	.merge('user.', userRouter)
	.merge('invites.', inviteRouter)
	.merge('rewards.', rewardsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
