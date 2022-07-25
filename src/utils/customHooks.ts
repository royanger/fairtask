import { useSession } from 'next-auth/react';
import { trpc } from './trpc';

export const useHydratedSession = () => {
	const { data: session } = useSession();
	if (!session || !session.user)
		throw new Error('Only use this when you hydrated session via gSSP');

	return {
		...session,
		user: { ...session.user, id: session.user.id!, name: session.user.name! },
	};
};

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
