import { useSession, signIn, signOut } from 'next-auth/react';
import Router from 'next/router';

export default function AddTask() {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return (
			<>
				<p>loading</p>
			</>
		);
	}

	if (!session) {
		return Router.push('/login');
	}

	return (
		<>
			<h1>Add Tasks</h1>
		</>
	);
}
