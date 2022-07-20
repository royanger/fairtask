import type { SVGProps } from 'react';

export default function Edit(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="19"
			height="19"
			viewBox="0 0 19 19"
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			{...props}
		>
			<path
				d="M0 19H3.75L14.81 7.94L11.06 4.19L0 15.25V19ZM2 16.08L11.06 7.02L11.98 7.94L2.92 17H2V16.08ZM15.37 1.29C15.2775 1.1973 15.1676 1.12375 15.0466 1.07357C14.9257 1.02339 14.796 0.997559 14.665 0.997559C14.534 0.997559 14.4043 1.02339 14.2834 1.07357C14.1624 1.12375 14.0525 1.1973 13.96 1.29L12.13 3.12L15.88 6.87L17.71 5.04C17.8027 4.94749 17.8762 4.8376 17.9264 4.71663C17.9766 4.59565 18.0024 4.46597 18.0024 4.335C18.0024 4.20403 17.9766 4.07435 17.9264 3.95338C17.8762 3.83241 17.8027 3.72252 17.71 3.63L15.37 1.29Z"
				fill="#262626"
			/>
		</svg>
	);
}