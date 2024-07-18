import React from "react";
import { z } from "zod";
import { redirect, useFetcher, useLoaderData, Form, useSearchParams } from "@remix-run/react";
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
                    where: { id },
                }): false;
            })
        }).passthrough()
    );

    if (parsedQueryString.error) return redirect("/product/error?type=product-id-malformed");

    const { id, ...rest } = parsedQueryString.data;

    const product = await prisma.product.findFirst({
        where: { id },
        include: {
            category: true,
            variants: {
                include: {
                    options: {
                        orderBy: {
                            sort: "asc"
                        }
                    }
                },
                orderBy: {
                    sort: "asc"
                }
            },
        }
    });

    if (!product) return redirect("/product/error?type=product-deleted");

    // if (product.variants.length !== product.variants.map(variant => variant.options.find(option => option.id === rest[variant.id])).filter(variant => variant ? variant : null).filter(Boolean).length) {

    // }

    console.log(JSON.stringify(await prisma.inventory.findFirst({
        where: {
            skus: {
                some: {
                    OR: Object.keys(rest).map(key => ({
                        productId: product.id,
                        optionId: rest[key] as string,
                        variantId: key,
                    }))
                }
            }
        },
        include: {
            skus: {
                include: {
                    option: true
                }
            },
            stocks: true
        }
    }), null, 4));
    return {
        type: "success" as const,
        data: {
            product,
            inventory: !product.variants.map(variant => variant.options.find(option => option.id === rest[variant.id])).map(variant => variant ? variant : null).includes(null) ? await prisma.inventory.findFirst({
                where: {
                    skus: {
                        some: {
                            OR: Object.keys(rest).map(key => ({
                                productId: product.id,
                                optionId: rest[key] as string,
                                variantId: key,
                            }))
                        }
                    }
                },
                include: {
                    skus: {
                        include: {
                            option: true
                        },
                        orderBy: {
                            sort: "asc"
                        }
                    },
                    stocks: true
                }
            }) : null
        }
    };
};

// const 

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const fetcher = useFetcher<typeof action>();
    const loaderData = useLoaderData<typeof loader>();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const methods = useRemixForm<z.infer<typeof validationSchema>>({
        fetcher,
        resolver: zodResolver(validationSchema),
        defaultValues: { id: loaderData.data.product.id }
    });

    const handleOnSelectOption = (variantId: string, optionId: string) => () => {
        setSearchParams(param => {
            param.set(variantId, optionId);

            return param;
        });
    };

    return (
        <div className="container mx-auto flex gap-8">
            <div className="flex-[2]">
                <div className="size-full aspect-square bg-gray-200 animate-pulse rounded-xl">

                </div>
            </div>
            <div className="flex-[3.5]">
                <RemixFormProvider { ...methods }>
                    <Form onSubmit={methods.handleSubmit}>
                    <div>
                        <div className="text-sm text-gray-400">{ loaderData.data.product.category.name }</div>
                        <div className="text-xl font-semibold tracking-tight">{ loaderData.data.product.name }</div>
                        { loaderData.data.inventory && (
                            <div className="text-sm text-gray-400">{ loaderData.data.product.name } / { loaderData.data.inventory.skus.map(sku => sku.option.name).join(" / ") }</div> 
                        ) }
                        <div className="space-y-3">
                            { loaderData.data.product.variants.map(variant => (
                                <div key={variant.id}>
                                    <div>{ variant.name }</div>
                                    <div className="flex items-center gap-3">
                                        { variant.options.map(option => (
                                            <div key={option.id} className="h-12 px-3 text-sm text-gray-300 flex items-center ring-1 ring-gray-200 rounded-lg" onClick={handleOnSelectOption(variant.id, option.id)}>{ option.name }</div>
                                        )) }
                                    </div>
                                </div>
                            )) }
                        </div>
                    </div>
                    </Form>
                </RemixFormProvider>
            </div>
            <div className="flex-[2]">
                <div>Hi im third column</div>
            </div>
        </div>
    );
};

export default Page;