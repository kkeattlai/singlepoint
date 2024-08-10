import React from "react";
import { z } from "zod";
import { type Product } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { SerializeFrom, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

import { masonry, recursive } from "~/utils";
import { prisma } from "~/services/db.server";
import { queryString } from "~/services/queryString.server";
import { getCategoryLeaf, getCategoryParent } from "~/prisma/rawQuery";

import Categories from "./Categories";
import Brands from "./Brands";

export const action = async ({ request }: ActionFunctionArgs) => {
    return {};
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const parsedQueryString = await queryString.safeParse(request,
		z.object({
			storeId: z.string().optional(),
            categoryId: z.string().optional(),
            brandId: z.string().optional()
		})
	);
    
    const categoryParentIds = parsedQueryString.data && parsedQueryString.data.categoryId && (await getCategoryParent(parsedQueryString.data?.categoryId)).reverse().map(category => ({ id: category.id, name: category.name })) || [];
    const categoryLeafIds = parsedQueryString.success && parsedQueryString.data.categoryId && (await getCategoryLeaf(parsedQueryString.data.categoryId)).map(category => category.id) || [];
    
    const products = await prisma.product.findMany({
        where: {
            AND: [
                ...(parsedQueryString.data?.storeId) ? [
                    { storeId: parsedQueryString.data.storeId }
                ] : [],
                ...(parsedQueryString.data?.categoryId) ? [
                    { categoryId: { in: categoryLeafIds } }
                ] : [],
                ...(parsedQueryString.data?.brandId) ? [
                    { brandId: parsedQueryString.data.brandId }
                ] : []
            ]
        },
        include: {
            images: {
                orderBy: {
                    sort: "asc"
                }
            },
            variants: {
                include: {
                    options: {
                        orderBy: {
                            sort: "asc"
                        }
                    },
                },
                orderBy: {
                    sort: "asc"
                }
            }
        }
    });
    
    return {
        type: "success" as const,
        data: {
            breadcrumbs: categoryParentIds,
            categories: recursive(
                await prisma.category.findMany({
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
                })
            , null),
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
            }),
            masonry: {
                ["2"]: masonry(products, 2),
                ["3"]: masonry(products, 3),
                ["4"]: masonry(products, 4),
            }
        }
    };
};

type ProductProps = {
    product: SerializeFrom<typeof loader>["data"]["masonry"]["2"][number];
};

const Product: React.FC<ProductProps> = ({ product }) => {
    const salePrice = product.salePrice / 100;
    const retailPrice = product.retailPrice / 100;
    const discountPrice = retailPrice - salePrice;

    return (
        <div className="break-inside-avoid space-y-1.5">
            <img className="w-full rounded-lg" src={product.images[0].url} />
            <div className="space-y-0">
                <div className="font-semibold tracking-tight">{ product.name }</div>
                { discountPrice ? (
                    <div className="flex items-center gap-1">
                        <div className="">
                            <span className="text-[10px] text-gray-500">B$</span>
                            <span className="text-sm text-gray-800 font-semibold tracking-tight">{ salePrice.toFixed(2) }</span>
                        </div>
                        <div className="text-xs text-gray-400 line-through">
                            <span>B$</span>
                            <span>{ salePrice.toFixed(2) }</span>
                        </div>
                    </div>
                ) : (
                    <div className="">
                        <span className="text-[10px] text-gray-500">B$</span>
                        <span className="text-sm text-gray-800 font-semibold tracking-tight">{ salePrice.toFixed(2) }</span>
                    </div>
                ) }
            </div>
        </div>
    );
};

type MasonryProps = {
    masonry: SerializeFrom<typeof loader>["data"]["masonry"];
};

const Masonry: React.FC<MasonryProps> = ({ masonry }) => {
    return (
        <div>
            <div className="grid lg:hidden grid-cols-2 gap-4">
                { masonry[2].map(product => (
                    <Product key={product.id} product={product} />
                )) }
            </div>
            <div className="hidden lg:grid xl:hidden grid-cols-3 gap-4">
                { masonry[3].map(product => (
                    <Product key={product.id} product={product} />
                )) }
            </div>
            <div className="hidden xl:grid grid-cols-4 gap-6">
                { masonry[4].map(product => (
                    <Product key={product.id} product={product} />
                )) }
            </div>
        </div>
    );
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <div className="container mx-auto flex p-4 gap-8">
            <div className="hidden xl:flex flex-col flex-[1.05] gap-10">
                <Categories breadcrumbs={loaderData.data.breadcrumbs} categories={loaderData.data.categories} />
                <Brands brands={loaderData.data.brands} />
            </div>
            <div className="flex-[3.15] space-y-4">
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-600 font-semibold tracking-tight">Sort by: </div>
                        <select className="text-sm">
                            <option>Latest</option>
                            <option>Popularity</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-600 font-semibold tracking-tight">Items per page: </div>
                        <div className="px-3 flex items-center gap-3">
                            <div className="text-sm text-indigo-600 font-semibold tracking-tight">14</div>
                            <div className="text-sm text-indigo-600 font-semibold tracking-tight">28</div>
                            <div className="text-sm text-indigo-600 font-semibold tracking-tight">42</div>
                        </div>
                    </div>
                </div>
                <Masonry masonry={loaderData.data.masonry} />
            </div>
        </div>
    );
};

export default Page;