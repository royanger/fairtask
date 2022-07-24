import { signIn, signOut } from 'next-auth/react';
import { useHydratedSession } from '../../utils/useHydratedSession';

export default function LoginButton() {
	const session = useHydratedSession();

	if (session) {
		return (
			<>
				Signed in as {session.user?.name}
				<br />
				<button onClick={() => signOut()}>Sign Out</button>
			</>
		);
	}

	return (
		<>
			Not signed in <br />
			<button onClick={() => signIn()}>Sign In</button>
		</>
	);
}
