// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { exampleRouter } from './example';
import { authRouter } from './auth';
import { tasksRouter } from './tasks';
import { teamRouter } from './team';
import { userRouter } from './user';
import { inviteRouter } from './invites';

export const appRouter = createRouter()
	.transformer(superjson)
	.merge('example.', exampleRouter)
	.merge('auth.', authRouter)
	.merge('tasks.', tasksRouter)
	.merge('team.', teamRouter)
	.merge('user.', userRouter)
	.merge('invites.', inviteRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
