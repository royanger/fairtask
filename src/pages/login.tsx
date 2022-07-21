import { getProviders, signIn } from 'next-auth/react';
import { GitHubIcon, TwitterIcon } from '../components/icons';

interface Providers {
	providers: {
		email: Provider;
		github: Provider;
		twitter: Provider;
	};
}
interface Provider {
	id: string;
	name: string;
	type: string;
	signinUrl: string;
	callbackUrl: string;
}

interface DynamicIcons {
	type: string;
	classes: string;
}

const DynamicIcons = ({ type, classes }: DynamicIcons) => {
	const components: { [key: string]: any } = {
		github: GitHubIcon,
		twitter: TwitterIcon,
	};
	const Icon = components[type];

	return <Icon className={classes}></Icon>;
};
const brandColors: { [index: string]: any } = {
	twitter: 'text-twitter',
	github: 'text-github',
};

export default function Login({ providers }: Providers) {
	// console.log(providers);
	return (
		<div className="min-h-screen flex flex-col items-center">
			<div
				className="absolute bottom-8 right-[-155px] w-[368px] h-[326px]"
				style={{
					backgroundImage: 'url(/images/background-logo.png)',
					opacity: '10%',
				}}
			></div>
			<div className="z-10 flex flex-col items-center justify-center min-h-screen w-4/5">
				<h1 className="font-poppins text-2xl mb-7 ">
					Login/Create Account
				</h1>
				{Object.values(providers)
					.filter(provider => provider.id !== 'email')
					.map(provider => {
						return (
							<div
								key={provider.name}
								className="flex flex-row items-center justify-center border-[1px] border-grey py-2 mb-2 rounded-2xl w-full"
							>
								<button
									onClick={() =>
										signIn(provider.id, { callbackUrl: '/profile' })
									}
									className="flex flex-row items-center justify-center"
								>
									<DynamicIcons
										type={provider.id}
										classes={`w-10 ${brandColors[provider.id]}`}
									></DynamicIcons>
									<p className="ml-4 text-xl"> {provider.name}</p>
								</button>
							</div>
						);
					})}

				{providers?.email ? (
					<>
						<div className="or h-20 flex items-center justify-center w-3/5">
							<span className="px-4">OR</span>
						</div>
						<div className="flex flex-row items-center justify-center border-[1px] border-grey py-6 px-4 mb-2 rounded-2xl w-full">
							<form
								action="api/auth/signin/email"
								method="POST"
								className="flex flex-col"
							>
								<input
									type="hidden"
									name="csrfToken"
									value="3aa550e9eec3716c077f949857b02990ce76c667e31d653d138d01198a2cc767"
								/>
								<label
									className="text-lg pb-2"
									htmlFor="input-email-for-email-provider"
								>
									Email:
								</label>
								<input
									id="input-email-for-email-provider"
									type="email"
									name="email"
									placeholder="email@example.com"
									required={true}
									className="border-2 border-green !w-full block text-lg py-2 px-4 mb-4 rounded-2xl"
								/>

								<button
									type="submit"
									className="bg-green text-white font-poppins text-xl px-10 py-3 rounded-2xl "
								>
									Send Email
								</button>
							</form>
						</div>
					</>
				) : (
					''
				)}
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	return { props: { providers: await getProviders() } };
}
