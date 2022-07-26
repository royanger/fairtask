interface FormButton {
	children: React.ReactNode;
}

export const FormButton = ({ children }: FormButton) => {
	return (
		<button
			className="bg-green py-2 px-4 text-white text-poppins rounded-3xl text-sm"
			type="submit"
		>
			{children}
		</button>
	);
};
