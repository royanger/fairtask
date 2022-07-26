import { useSession } from 'next-auth/react';
import { trpc } from './trpc';

// wrapper around useSession
// - since gSSP checks for user auth on protect pages, the session always exists
// - TypeScript doesn't understand this and flags 'session' as possibly undefined
// - this prevents that without having to do checks on all protected pages
export const useHydratedSession = () => {
	const { data: session } = useSession();
	if (!session || !session.user)
		throw new Error('Only use this when you hydrated session via gSSP');

	return {
		...session,
		user: { ...session.user, id: session.user.id!, name: session.user.name! },
	};
};

export const useHydratedEmailSession = () => {
	const { data: session } = useSession();
	if (!session || !session.user)
		throw new Error('Only use this when you hydrated session via gSSP');

	return {
		...session,
		user: {
			...session.user,
			id: session.user.id!,
			name: session.user.name!,
			email: session.user.email!,
		},
	};
};

// return whether a user has an email or profile pic set
// used to toast to ask user to set email
export const useUserInfoCheck = (userId: string) => {
	const { data: userInfo, isLoading } = trpc.useQuery([
		'user.userInfo',
		{ userId: userId },
	]);

	return {
		isLoading: isLoading,
		userInfo: {
			hasEmail: userInfo?.email ? true : false,
			hasProfileImage: userInfo?.image ? true : false,
		},
	};
};
