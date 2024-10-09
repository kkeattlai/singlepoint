import React from "react";
import { Outlet, useLoaderData } from "@remix-run/react"
import { type LoaderFunctionArgs } from "@remix-run/node";

import { recursive } from "~/utils";

import Categories from "./Categories";
import Brands from "./Brands";
import { prisma } from "~/services/db.server";
import { queryString } from "~/services/queryString.server";
import { getCategoryLeaf, getCategoryParent } from "~/prisma/rawQuery";
import { z } from "zod";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const parsedQueryString = await queryString.safeParse(request,
		z.object({
			storeId: z.string().optional(),
            categoryId: z.string().optional(),
            brandId: z.string().optional()
		})
	);

    const categoryLeafIds = parsedQueryString.success && parsedQueryString.data.categoryId && (await getCategoryLeaf(parsedQueryString.data.categoryId)).map(category => category.id) || [];
    const categoryParentIds = parsedQueryString.data && parsedQueryString.data.categoryId && (await getCategoryParent(parsedQueryString.data?.categoryId)).reverse().map(category => ({ id: category.id, name: category.name })) || [];

    const category = await prisma.category.findMany({
        include: {
            _count: {
                select: {
                    products: {
                        where: {
                            AND: [
                                // ...(parsedQueryString.data?.storeId) ? [
                                //     { storeId: parsedQueryString.data.storeId }
                                // ] : [],
                                // // ...(parsedQueryString.data?.categoryId) ? [
                                // //     { categoryId: { in: categoryLeafIds } }
                                // // ] : [],
                                // ...(parsedQueryString.data?.brandId) ? [
                                //     { brandId: parsedQueryString.data.brandId }
                                // ] : []
                            ]
                        },
                    }
                }
            }
        },
        orderBy: {
            sort: "asc"
        }
    });

    return {
        data: {
            breadcrumbs: categoryParentIds,
            brands: await prisma.brand.findMany({
                include: {
                    _count: {
                        select: {
                            products: {
                                where: {
                                    AND: [
                                        // ...(parsedQueryString.data?.storeId) ? [
                                        //     { storeId: parsedQueryString.data.storeId }
                                        // ] : [],
                                        // ...(parsedQueryString.data?.categoryId) ? [
                                        //     { categoryId: { in: categoryLeafIds } }
                                        // ] : [],
                                        // // ...(parsedQueryString.data?.brandId) ? [
                                        // //     { brandId: parsedQueryString.data.brandId }
                                        // // ] : []
                                    ]
                                },
                            }
                        }
                    }
                },
                orderBy: {
                    sort: "asc"
                }
            }),
            categories: recursive(category, null)
        }
    };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto">
            <div className="flex gap-6 xl:gap-8">
                <div className="hidden lg:flex flex-col lg:flex-[1] space-y-12">
                    <Categories categories={loaderData.data.categories} breadcrumbs={loaderData.data.breadcrumbs} />
                    <Brands brands={loaderData.data.brands} />
                </div>
                <div className="flex flex-col flex-[2.75] xl:flex-[3.5] gap-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Page;