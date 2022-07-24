import MobileMenu from '../menus/MobileMenu';

interface Layout {
	children: React.ReactNode;
}

export default function Layout({ children }: Layout) {
	return (
		<>
			<div>
				{children}
				<MobileMenu />
			</div>
		</>
	);
}
