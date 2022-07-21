import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Router from 'next/router';

export default function Account() {
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

	console.log(session);
	return (
		<>
			<h1 className="text-2xl border-2  border-green font-sfprodisplay">
				Your Account
			</h1>
			<div>
				{session?.user?.image ? (
					<Image
						src={session.user.image}
						alt={`${session.user.name}'s Profile Image`}
						width={48}
						height={48}
					/>
				) : (
					''
				)}
			</div>
			<div>
				<h2>{session?.user?.name}</h2>
				<p>{session?.user?.email}</p>
			</div>
			<div>
				<h3 className="font-poppins">Add Mate or Partner</h3>
				<p>Add a mate, partner or roommate so you can share tasks</p>
			</div>
		</>
	);
}
