import { z } from "zod";

// export const isValidationError = <T>(error: T): error is z.SafeParseError<T> => {
//     return error !== null && error !== undefined;
// };
export type ErrorFetcherData<T> = Extract<T, { type: "error" }>;
export type SuccessFetcherData<T> = Extract<T, { type: "success" }>;

export const isError = <T>(error: T): error is ErrorFetcherData<T> => {
    return error !== null && error !== undefined && typeof error === "object" && "type" in error && error.type === "error" && "errors" in error
};

export const isSuccess = <T>(error: T): error is SuccessFetcherData<T> => {
    return error !== null && error !== undefined && typeof error === "object" && "type" in error && error.type === "success" && "data" in error
};