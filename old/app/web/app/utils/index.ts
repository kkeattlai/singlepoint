import { Category } from "@prisma/client";

// export const isValidationError = <T>(error: T): error is z.SafeParseError<T> => {
//     return error !== null && error !== undefined;
// };
export type ErrorFetcherData = {
    type: "error";
    errors: {
        id: string;
        code: string;
        message: string;
    }[];
};
export type SuccessFetcherData<T> = Extract<T, { type: "success" }>;

export const isGeneralErrorArray = (errors: unknown): errors is { code: string; message: string; }[] => {
    return errors !== null && errors !== undefined && typeof errors === "object" && Array.isArray(errors) &&
    errors.every(error => 
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error &&
        typeof error.code === "string" &&
        typeof error.message === "string"
    )
};

export const isError = (error: unknown): error is ErrorFetcherData => {
    return error !== null && error !== undefined && typeof error === "object" &&
        "type" in error && error.type === "error" && "errors" in error &&
        Array.isArray(error.errors) && error.errors.every(error => 
            typeof error === "object" &&
            error !== null &&
            "id" in error &&
            "code" in error &&
            "message" in error &&
            typeof error.id === "string" &&
            typeof error.code === "string" &&
            typeof error.message === "string"
        );
};

export const isSuccess = <T>(error: T): error is SuccessFetcherData<T> => {
    return error !== null && error !== undefined && typeof error === "object" && "type" in error && error.type === "success" && "data" in error
};

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