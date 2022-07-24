import { useSession } from 'next-auth/react';

export const useHydratedSession = () => {
	const { data: session } = useSession();
	if (!session || !session.user)
		throw new Error('Only use this when you hydrated session via gSSP');

	return {
		...session,
		user: { ...session.user, id: session.user.id!, name: session.user.name! },
	};
};
