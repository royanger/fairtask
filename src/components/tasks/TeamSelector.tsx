import { useHydratedSession } from '@utils/customHooks';

export default function TeamSelector() {
	const session = useHydratedSession();

	return (
		<div className="border-2 border-green">
			<h2 className="">The A team!</h2>
			<div>
				{session && session.user && session.user.name ? (
					<p>{session.user?.name}r</p>
				) : (
					<p>blank</p>
				)}
			</div>
		</div>
	);
}
