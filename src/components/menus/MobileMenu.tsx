import Link from 'next/link';

export default function MobileMenu() {
	return (
		<div className="fixed bottom-0 right-0 left-0 bg-white">
			<div className="flex items-center justify-center">
				<div className="grow flex items-center justify-center my-2">
					<Link href="/tasks">Tasks</Link>
				</div>

				<div className="grow flex items-center justify-center">
					<Link href="/rewards">Rewards</Link>
				</div>
				<div className="grow flex items-center justify-center">
					<Link href="/profile">Profile</Link>
				</div>
			</div>
		</div>
	);
}
