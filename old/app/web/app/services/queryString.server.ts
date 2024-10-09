import { z, SafeParseSuccess, SafeParseError } from "zod";
import queryStringParser from "query-string";

export const queryString = {
    parse: async <T extends z.ZodTypeAny>(request: Request, schema: T): Promise<z.infer<T>> =>
        schema.parseAsync(queryStringParser.parse(new URL(request.url).search))
    ,
    safeParse: async <T extends z.ZodTypeAny>(request: Request, schema: T): Promise<SafeParseSuccess<z.infer<T>> | SafeParseError<z.infer<T>>> =>
        await schema.safeParseAsync(queryStringParser.parse(new URL(request.url).search))
    ,
};