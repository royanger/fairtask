import { AssignIcon, UserIcon } from '@components/icons';
import { useHydratedSession } from '@utils/customHooks';
import { trpc } from '@utils/trpc';
import Image from 'next/image';

interface CategorySelector {
	register: Function;
}

export const CategorySelector = ({ register }: CategorySelector) => {
	const session = useHydratedSession();
	const { data: cats, isLoading } = trpc.useQuery(['rewards.getCats']);

	if (isLoading) return null;
	if (!isLoading && (!cats || cats.length < 1)) return null;

	return (
		<div className="py-4 px-3 flex flex-col rounded-3xl mb-4 categories">
			<div className="flex flex-col items-start mt-5">
				<div className="">Select Category</div>
			</div>
			<div className="grow grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 gap-y-6 mt-8">
				{cats?.map(cat => {
					return (
						<div key={cat.id} className="flex flex-col items-center">
							<label className="flex flex-col items-center justify-center">
								<input
									type="radio"
									{...register('selectedCategory', { required: true })}
									id={cat.id}
									value={cat.id}
								/>

								<Image
									src={`/images/categories/${cat.image}`}
									alt={`${cat.name} - Category`}
									width={75}
									height={75}
									className="rounded-full"
								/>
								<p className="mt-2">{cat.name}</p>
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
};
