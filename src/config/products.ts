export const sortOptions = [
    { label: 'Date: Old to new', value: 'createdAt.asc' },
    {
        label: 'Date: New to old',
        value: 'createdAt.desc',
    },
    { label: 'Price: Low to high', value: 'price.asc' },
    { label: 'Price: High to low', value: 'price.desc' },
    {
        label: 'Alphabetical: A to Z',
        value: 'name.asc',
    },
    {
        label: 'Alphabetical: Z to A',
        value: 'name.desc',
    },
];

export const productCategories = [
    {
        title: 'clothing',
        image: '/images/clothing-one.jpg',
        icon: 'shirt' as 'shirt',
        subcategories: [
            {
                title: 'T-shirts',
                description: 'Cool and comfy tees for effortless style.',
                slug: 't-shirts',
            },
            {
                title: 'Hoodies',
                description: 'Cozy up in trendy hoodies.',
                slug: 'hoodies',
            },
            {
                title: 'Pants',
                description: 'Relaxed and stylish pants for everyday wear.',
                slug: 'pants',
            },
            {
                title: 'Shorts',
                description: 'Stay cool with casual and comfortable shorts.',
                slug: 'shorts',
            },
            {
                title: 'Hats',
                description: 'Top off your look with stylish and laid-back hats.',
                slug: 'hats',
            },
        ],
    },
    {
        title: 'shoes',
        image: '/images/shoe-one.jpg',
        icon: 'footprints' as 'footprints',
        subcategories: [
            {
                title: 'Low Tops',
                description: 'Rad low tops shoes for a stylish low-profile look.',
                slug: 'low-tops',
            },
            {
                title: 'High Tops',
                description: 'Elevate your style with rad high top shoes.',
                slug: 'high-tops',
            },
            {
                title: 'Slip-ons',
                description: 'Effortless style with rad slip-on shoes.',
                slug: 'slip-ons',
            },
            {
                title: 'Pros',
                description: 'Performance-driven rad shoes for the pros.',
                slug: 'pros',
            },
            {
                title: 'Classics',
                description: 'Timeless style with rad classic shoes.',
                slug: 'classics',
            },
        ],
    },
    {
        title: 'accessories',
        image: '/images/accessories-one.jpg',
        icon: 'backpack' as 'backpack',
        subcategories: [
            {
                title: 'Socks',
                description: 'Keep your feet comfy and stylish with our rad socks.',
                slug: 'socks',
            },
            {
                title: 'Backpacks',
                description: 'Carry your gear in style with our rad backpacks.',
                slug: 'backpacks',
            },
        ],
    },
];
// ] satisfies Category[];

export const productTags = [
    'new',
    'sale',
    'bestseller',
    'featured',
    'popular',
    'trending',
    'limited',
    'exclusive',
];

export function getSubcategories(category?: string) {
    if (!category) return [];

    const subcategories =
        productCategories
            .find((c) => c.title === category)
            ?.subcategories.map((s) => ({
                label: s.title,
                value: s.slug,
            })) ?? [];

    return subcategories;
}
