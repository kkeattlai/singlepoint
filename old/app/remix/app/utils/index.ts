import { Prisma, type Category } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";

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

type SuccessData<T> = Extract<T, { type: "success" }>;

export const isSuccess = <T,>(data: T): data is SuccessData<T> => {
    return data !== null && data !== undefined && typeof data === "object" &&
        "type" in data && "data" in data;
};

type ErrorData<T> = Extract<T, { type: "error" }>;

export const isError = <T,>(data: T): data is ErrorData<T> => {
    return data !== null && data !== undefined && typeof data === "object" &&
        "type" in data && "error" in data;
};

export const getProductUrl = (product: SerializeFrom<Prisma.ProductGetPayload<{ include: { images: true, variants: { include: { options: true } } } }>>) => {
    return `/product?id=${product.id}${product.variants.filter(variant => variant.options.length > 0).length > 0 ? `&${product.variants.map(variant => `${variant.id}=${variant.options[0].id}`).join("&")}` : ``}`
};

export const getProductInventoryUrl = (inventory: SerializeFrom<Prisma.InventoryGetPayload<{ include: { skus: true } }>>) => {
    return `/product?id=${inventory.productId}${inventory.skus.length > 0 ? `&${inventory.skus.map(sku => `${sku.variantId}=${sku.optionId}`).join("&")}` : ``}`
};

export * from "./useCarousel";