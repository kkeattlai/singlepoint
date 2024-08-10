import { z } from "zod";
import { json } from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import { FieldErrors, FieldValues } from "react-hook-form";

type ValidationError<T> = z.ZodError<T> | FieldErrors<FieldValues>;

export const validationError = <T>(errors: ValidationError<T>, receivedValues: Record<any, any>,) => {
    // console.log(error.flatten());
    // console.log(JSON.stringify(error, null, 4));

    if (errors instanceof z.ZodError) {
        return {
            type: "error" as const,
            // ...error
            errors: errors.issues.map(issue => `${issue.message}`),
            receivedValues
        };
    };

    // const flattenedZodErrors = error.errors.flatten();

    // console.log(error.errors.map(error => `${error.message}`));

    // console.log("zod Error");
    // if (error.errors instanceof z.ZodError) {
    //     console.log({ error });
    //     console.log(error.errors.issues.map(issue => `${issue.message}`));
    // }
    // console.log({
    //     type: "error" as const,
    //     errors: error.errors.issues.map(issue => `${issue.message}`)
    // });
    
    return {
        type: "error" as const,
        // errors: error.errors.issues.map(issue => `${issue.message}`)
        ...errors,
        receivedValues
    };
};

const errorStatus = {
    "Unauthorised": "Email / Password is incorrect."
} as const;

type ErrorStatus = keyof typeof errorStatus;

export const responseError = (errors: { code: ErrorStatus, message?: string }[], receivedValues: Record<any, any>) => {
    return {
        type: "error" as const,
        errors: errors.map(error => ({
            id: uuidv4(),
            code: error.code,
            message: error.message ? error.message : errorStatus[error.code]
        })),
        receivedValues
    };
};