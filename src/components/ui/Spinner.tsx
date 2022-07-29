export const Spinner = () => {
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<div role="alert" aria-live="assertive">
				<div className="spinner">
					<p className="loader-label" aria-hidden="false">
						Loading
					</p>
					<div aria-hidden="true"></div>
					<div aria-hidden="true"></div>
					<div aria-hidden="true"></div>
					<div aria-hidden="true"></div>
					<div aria-hidden="true"></div>
					<div aria-hidden="true"></div>
					<div aria-hidden="true"></div>
					<div aria-hidden="true"></div>
					<div aria-hidden="true"></div>
					<div aria-hidden="true"></div>
					<div aria-hidden="true"></div>
					<div aria-hidden="true"></div>
				</div>
			</div>
		</div>
	);
};
