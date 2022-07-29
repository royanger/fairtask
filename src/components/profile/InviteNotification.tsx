import { Button } from '@components/ui/Button';
import { useHydratedSession } from '@utils/customHooks';
import { trpc } from '@utils/trpc';
import Link from 'next/link';

export const InviteNotification = () => {
	const session = useHydratedSession();

	const { data: invites, isLoading } = trpc.useQuery([
		'invites.getInvites',
		{ email: session.user.email },
	]);

	if (isLoading) return null;

	if (!isLoading && invites && invites.length < 1) return null;

	return (
		<div className="mt-12 border-[1px] border-grey-100 py-8 px-6 shadow-md rounded-lg grid grid-cols-8">
			<div className="col-span-6">
				<h2 className="text-xl font-sfprodisplay">Pending Invites</h2>
				<p>You have {invites?.length} pending invite</p>
			</div>
			<div className="col-span-2 flex items-center justify-center">
				<Button href="/profile/invites">View</Button>
			</div>
		</div>
	);
};
