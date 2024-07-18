import { z } from "zod";
import { json } from "@remix-run/react";
import { FieldErrors, FieldValues } from "react-hook-form";

type ValidationError<T> = {
    type: "base";
    errors: z.ZodError<T>;
} | {
    type: "forms";
    errors: FieldErrors<FieldValues>,
    receivedValues: Record<any, any>,
};

export const validationError = <T>(error: ValidationError<T>) => {
    // console.log(error.flatten());
    // console.log(JSON.stringify(error, null, 4));

    if (error.type === "forms") return { ...error };

    // const flattenedZodErrors = error.errors.flatten();

    // console.log(error.errors.map(error => `${error.message}`));

    // console.log("zod Error");
    // if (error.errors instanceof z.ZodError) {
    //     console.log({ error });
    //     console.log(error.errors.issues.map(issue => `${issue.message}`));
    // }
    console.log({
        type: "error" as const,
        errors: error.errors.issues.map(issue => `${issue.message}`)
    });
    
    return {
        type: "error" as const,
        errors: error.errors.issues.map(issue => `${issue.message}`)
    };
};