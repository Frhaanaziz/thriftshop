// 'use client';
// import { SupabaseClient, User } from '@supabase/supabase-js';
// import { faker } from '@faker-js/faker';
// import { Button } from '@components/ui/button';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// import toast from 'react-hot-toast';
// import { categories, sub_category } from '@lib/constant';
// import { Products } from '@types';
// import { useState } from 'react';

// const supabase = createClientComponentClient();

// const UploadDummyDataButton = ({ author_id }: { author_id: User['id'] }) => {
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     return (
//         <Button
//             onClick={async () => {
//                 try {
//                     setIsLoading(true);
//                     await uploadDummyData({
//                         supabase,
//                         author_id,
//                     });
//                     toast.success('Dummy data uploaded successfully');
//                 } catch (error: any) {
//                     toast.error(error.message);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             }}
//             disabled={isLoading}
//         >
//             Upload Dummy Data
//         </Button>
//     );
// };

// export default UploadDummyDataButton;

// async function uploadDummyData({ supabase, author_id, numStores = 50 }: UploadDummyDataProps) {
//     const stores = [];

//     for (let i = 0; i < numStores; i++) {
//         stores.push({
//             author_id,
//             name: `${faker.person.fullName()} Store`,
//             description: faker.lorem.paragraph(),
//         });
//     }

//     const { data, error } = await supabase.from('stores').insert(stores).select('id');
//     if (error) throw error;

//     const products: Products['Insert'][] = [];

//     for (let i = 0; i < numStores * 100; i++) {
//         const randomCategory = Math.floor(Math.random() * categories.length);
//         const subCategory = sub_category
//             .at(randomCategory)
//             ?.at(Math.floor(Math.random() * sub_category.at(randomCategory)!.length))!;

//         products.push({
//             name: faker.commerce.productName(),
//             category: categories.at(randomCategory)!,
//             price: Number(faker.commerce.price()),
//             sub_category: subCategory,
//             author_id,
//             description: faker.commerce.productDescription(),
//             inventory: Math.floor(Math.random() * 100),
//             rating: Number((Math.random() * 5).toFixed(2)),
//             store_id: data.at(Math.floor(Math.random() * data.length))!.id,
//             isPublic: true,
//             product_images: [faker.image.urlLoremFlickr({ width: 1080, height: 720, category: subCategory })],
//         });
//     }

//     const uploadProducts = await supabase.from('products').insert(products);
//     if (uploadProducts.error) throw uploadProducts.error;
// }

// type UploadDummyDataProps = {
//     supabase: SupabaseClient;
//     author_id: User['id'];
//     numStores?: number;
// };
