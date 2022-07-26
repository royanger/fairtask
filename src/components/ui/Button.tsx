import Link from 'next/link';

interface Button {
	href: string;
	children: React.ReactNode;
}

export const Button = ({ children, href }: Button) => {
	return (
		<Link href={href} passHref>
			<button className="bg-green text-white rounded-3xl py-2 px-6 shadow-md text-sm">
				{children}
			</button>
		</Link>
	);
};
