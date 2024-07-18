import React from "react";
import { z } from "zod";
import { redirect, useFetcher, useLoaderData, Form } from "@remix-run/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { RemixFormProvider, getValidatedFormData, useRemixForm } from "remix-hook-form";

import { isError } from "~/utils/error";
import { prisma } from "~/services/db.server";
import { queryString } from "~/services/queryString.server";
import { validationError } from "~/services/response.server";

const validationSchema = z.object({
    id: z.string().uuid()
});

export const action = async ({ request }: ActionFunctionArgs) => {
    const result = await getValidatedFormData(request, zodResolver(validationSchema));

    if (result.errors) return validationError({ type: "forms", ...result });

    return {
        type: "success" as const,
        data: {
            message: "Hi"
        }
    };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const parsedQueryString = await queryString.safeParse(request,
        z.object({
            id: z.string().refine(async id => {
                return id ? await prisma.product.findFirst({
                    where: { id }
                }): false;
            })
        })
    );

    // if (parsedQueryString.error) return validationError({ type: "base", errors: parsedQueryString.error });
    if (parsedQueryString.error) return redirect("/product/error?type=product-id-malformed");

    const { id } = parsedQueryString.data;

    const product = await prisma.product.findFirst({
        where: { id }
    });

    if (!product) return redirect("/product/error?type=product-deleted");

    return {
        type: "success" as const,
        data: {
            product
        }
    };
};

// const 

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const fetcher = useFetcher<typeof action>();
    const loaderData = useLoaderData<typeof loader>();
    const methods = useRemixForm<z.infer<typeof validationSchema>>({
        fetcher,
        resolver: zodResolver(validationSchema),
        defaultValues: { id: loaderData.data.product.id }
    });

    return (
        <div>
            <div>Hi from product</div>
            <RemixFormProvider { ...methods }>
                <Form onSubmit={methods.handleSubmit}>
                <div>
                    <input { ...methods.register("id") } name="id" />
                    { methods.formState.errors.id?.message }
                    <button type="submit">Submit</button>
                </div>
                </Form>
            </RemixFormProvider>
        </div>
    );
};

export default Page;