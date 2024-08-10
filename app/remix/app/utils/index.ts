import { type Category } from "@prisma/client";

export type RecursiveCategory = Category & {
    _count: { products: number };
    categories: RecursiveCategory[];
};

export const recursive = (categories: Array<Category & { _count: { products: number } }>, parent: string | null): RecursiveCategory[]  => {
    return categories.filter(category => category.parent === parent).map(category => {
        const nestedCategories = recursive(categories, category.id);
        const productCount = nestedCategories.reduce((acc, nested) => acc + nested._count.products, 0) + category._count.products;

        return {
            ...category,
            _count: { products: productCount },
            categories: recursive(categories, category.id)
        };
    });
};

export const masonry = <T>(items: T[], numOfColumns: number): T[] => {
    // Create an array of columns, each an empty array initially
    const columns: T[][] = Array.from({ length: numOfColumns }, () => []);

    // Distribute items into columns
    items.forEach((item, index) => {
        columns[index % numOfColumns].push(item);
    });

    // Flatten the columns into a single array while maintaining the correct order
    const result: T[] = [];
    const maxRows = Math.ceil(items.length / numOfColumns);

    for (let row = 0; row < maxRows; row++) {
        for (let col = 0; col < numOfColumns; col++) {
            if (columns[col][row] !== undefined) {
                result.push(columns[col][row]);
            }
        }
    }

    return result;
};