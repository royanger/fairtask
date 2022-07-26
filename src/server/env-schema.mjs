import { z } from 'zod';

export const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z.enum(['development', 'test', 'production']),
	NEXTAUTH_SECRET: z.string(),
	NEXTAUTH_URL: z.string().url(),
	TWITTER_CLIENT_ID: z.string(),
	TWITTER_CLIENT_SECRET: z.string(),
	EMAIL_SERVER: z.string(),
	EMAIL_FROM: z.string(),
	GITHUB_CLIENT_ID: z.string(),
	GITHUB_CLIENT_SECRET: z.string(),
});
