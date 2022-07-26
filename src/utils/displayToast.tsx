import Link from 'next/link';
import { toast } from 'react-toastify';

const NoEmailToast = () => {
	return (
		<Link href="/profile/edit">
			No email provided. Please update your Profile to receive household
			invites.
		</Link>
	);
};

export const displayToast = () => {
	toast.error(<NoEmailToast />, { toastId: 'stringToStopDupes' });
};
