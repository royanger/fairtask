import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

type TechnologyCardProps = {
	name: string;
	description: string;
	documentation: string;
};

const Home: NextPage = () => {
	const session = useSession();

	return (
		<div className="flex flex-col items-center">
			<Head>
				<title>Fair Task App</title>
				<meta
					name="description"
					content="Finish work, then have some fun!"
				/>
				<link rel="icon" href="/images/favicons/favicon.ico" />
			</Head>
			<header className="flex flex-row mt-4 mb-2 md:max-w-md">
				<div className="ml-8">
					<Image
						src="/images/fairtaskapp.png"
						alt="Fairtask App"
						width={75}
						height={68}
					/>
				</div>
				<div className="font-poppins text-[50px] leading-[75px] font-bold tracking-tight ml-4">
					Fairtask
				</div>
			</header>
			<main className="md:max-w-md">
				<div>
					<Image
						src="/images/landing-page.png"
						alt=""
						width={444}
						height={285}
					/>
				</div>
				<div className="flex-col items-center justify-center px-12">
					<h2 className="font-inter text-4xl mb-7">
						Finish work, then have some fun!
					</h2>
					<p className="text-lg mb-24 font-inter">
						Fairtask helps manage everyday tasks so you don’t have to.
					</p>
				</div>
				<div className="flex items-center justify-center mb-6">
					<Link href="/login">
						{session && session.data && session.data.user ? (
							<Link href="/profile">
								<button className="bg-green text-white font-poppins text-xl px-20 py-3 rounded-[75px]">
									{' '}
									Go to Dashboard
								</button>
							</Link>
						) : (
							<button className="bg-green text-white font-poppins text-xl px-20 py-3 rounded-[75px]">
								Get Started
							</button>
						)}
					</Link>
				</div>
				<div className="flex items-center justify-center">
					{session && session.data && session.data.user ? (
						''
					) : (
						<Link href="/login">
							<button className="text-green underline font-inter">
								Existing account? Log in
							</button>
						</Link>
					)}
				</div>
			</main>
		</div>
	);
};

export default Home;
