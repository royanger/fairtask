import MobileMenu from '../menus/MobileMenu';

interface Layout {
	children: React.ReactNode;
}

export default function Layout({ children }: Layout) {
	return (
		<>
			<div>
				<p>layout comp</p>
				{children}
				<MobileMenu />
			</div>
		</>
	);
}
