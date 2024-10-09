import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, FieldValues } from "react-hook-form";
import { getValidatedFormData as validate } from "remix-hook-form";

type ReturnGetValidatedFormData<T extends z.ZodTypeAny> = Promise<{
    receivedValues: Record<any, any>;
    errors: FieldErrors<FieldValues>;
    data: undefined;
} | {
    receivedValues: Record<any, any>;
    errors: undefined;
    data: z.infer<T>;
}>;

export const getValidatedFormData = async <T extends z.ZodTypeAny>(request: Request, validationSchema: T): ReturnGetValidatedFormData<T> => {
    return await validate(await request.formData(), zodResolver(validationSchema));
};

export const validationError = (errors: FieldErrors<FieldValues>, receivedValues: Record<any, any>) => {
    return {
        errors,
        defaultValues: receivedValues
    };
};