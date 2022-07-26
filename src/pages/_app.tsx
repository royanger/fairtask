// src/pages/_app.tsx
import * as React from 'react';
import { withTRPC } from '@trpc/next';
import superjson from 'superjson';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

// importing types
import type { AppRouter } from '../server/router';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

// importing css
import '../styles/globals.css';
import 'react-day-picker/dist/style.css';
import 'react-toastify/dist/ReactToastify.css';

export type NextPageWithLayout = NextPage & {
	getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const MyApp = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
	const getLayout = Component.getLayout || (page => page);

	return (
		<SessionProvider session={session}>
			{getLayout(<Component {...pageProps} />)}
			<ToastContainer
				position="top-center"
				autoClose={10000}
				theme="colored"
			/>
		</SessionProvider>
	);
};

const getBaseUrl = () => {
	if (typeof window !== 'undefined') {
		return '';
	}
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			url,
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			// queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);
