import React from "react";
import { z } from "zod";
import { NavLink, useLoaderData, useSearchParams } from "@remix-run/react";
import { TbChevronDown, TbChevronRight, TbHome, TbHome2, TbHomeFilled, TbX } from "react-icons/tb";
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

import Button from "~/components/Button";
import SelectField from "~/components/SelectField";
import { cn } from "~/components/utils";
import { masonry, recursive } from "~/utils";
import { prisma } from "~/services/db.server";
import { queryString } from "~/services/queryString.server";
import { getCategoryLeaf, getCategoryParent } from "~/prisma/rawQuery";

import Categories from "./Categories";
import Brands from "./Brands";
import Masonry from "./Products";
import { useFavourite } from "~/services/favourite.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    return {};
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const favourite = await useFavourite.parse(request);
    const parsedQueryString = await queryString.safeParse(request,
		z.object({
			storeId: z.string().optional(),
            categoryId: z.string().optional(),
            brandId: z.string().optional()
		})
	);

    const categoryParentIds = parsedQueryString.data && parsedQueryString.data.categoryId && (await getCategoryParent(parsedQueryString.data?.categoryId)).reverse().map(category => ({ id: category.id, name: category.name })) || [];
    const categoryLeafIds = parsedQueryString.success && parsedQueryString.data.categoryId && (await getCategoryLeaf(parsedQueryString.data.categoryId)).map(category => category.id) || [];

    const products = (await prisma.product.findMany({
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
            brand: true,
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
    })).map(product => ({
        ...product,
        isFavourite: favourite.some(favourite => favourite.id === product.id)
    }));

    const [ store, category, brand ] = await Promise.all([
        (parsedQueryString.success && parsedQueryString.data.storeId) ? await prisma.store.findFirst({
            where: {
                id: parsedQueryString.data.storeId
            }
        }) : null,
        (parsedQueryString.success && parsedQueryString.data.categoryId) ? prisma.category.findFirst({
            where: {
                id: parsedQueryString.data.categoryId
            }
        }) : null,
        (parsedQueryString.success && parsedQueryString.data.brandId) ? await prisma.brand.findFirst({
            where: {
                id: parsedQueryString.data.brandId
            }
        }) : null
    ]);

    return {
        type: "success" as const,
        data: {
            breadcrumbs: categoryParentIds,
            header: {
                ...(store) ? {
                    title: store.fullname,
                    subtitle: store.description
                } : (category) ? {
                    title: category.name,
                    subtitle: category.description
                } : {
                    title: "Home",
                    subtitle: "Discover the ultimate shopping experience at Singlepoint, where convenience meets variety. As a leading ecommerce platform, Singlepoint offers an extensive range of products, competitive prices, and exceptional customer service, making it the perfect destination for all your shopping needs."
                },
                categories: (await prisma.category.findMany({
                    where: { parent: category?.id ?? null },
                    include: {
                        _count: {
                            select: {
                                products: true
                            }
                        }
                    },
                    orderBy: {
                        sort: "asc"
                    }
                })).filter(category => category._count.products > 0)
            },
            filter: {
                store,
                category,
                brand
            },
            categories: recursive(
                await prisma.category.findMany({
                    include: {
                        _count: {
                            select: {
                                products: true
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
                                        ...(parsedQueryString.data?.storeId) ? [
                                            { storeId: parsedQueryString.data.storeId }
                                        ] : [],
                                        ...(parsedQueryString.data?.categoryId) ? [
                                            { categoryId: { in: categoryLeafIds } }
                                        ] : [],
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

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const loaderData = useLoaderData<typeof loader>();
    const [ searchParams, setSearchParams ] = useSearchParams();

    const handleOnNavigateCategoryChildren = (id: string) => () => {
        setSearchParams(param => {
            param.set("categoryId", id);

            return param;
        });
    };

    const handleOnRemoveFilter = (type: "store" | "category" | "brand") => () => {
        type === "store" &&
            setSearchParams(param => {
                param.delete("storeId");

                return param;
            });

        type === "category" &&
            setSearchParams(param => {
                param.delete("categoryId");

                return param;
            });

        type === "brand" &&
            setSearchParams(param => {
                param.delete("brandId");

                return param;
            });
    };

    return (
        <div className="container mx-auto flex p-4 gap-14">
            <div className="hidden xl:flex flex-col flex-[1] gap-10">
                <Categories breadcrumbs={loaderData.data.breadcrumbs} categories={loaderData.data.categories} />
                <Brands brands={loaderData.data.brands} />
            </div>
            <div className="flex-[3.45] space-y-4">
                { loaderData.data.breadcrumbs.length > 0 && (
                    <div className="flex items-center gap-0.5">
                        <NavLink to="/products">
                            <div className="text-xs text-sky-600 cursor-pointer hover:underline">Home</div>
                        </NavLink>
                        <div className="flex items-center px-0.5 text-xs text-gray-800">
                            <TbChevronRight className="inline" strokeWidth={3} />
                        </div>
                        { loaderData.data.breadcrumbs.map((breadcrumb, index) => (
                            <React.Fragment key={breadcrumb.id}>
                                <NavLink to={`/products?categoryId=${breadcrumb.id}`}>
                                    <div
                                        className={
                                            cn(
                                                "text-xs text-sky-600 cursor-pointer hover:underline",
                                                { "text-gray-800 font-semibold tracking-tighter": index === loaderData.data.breadcrumbs.length - 1 }
                                            )
                                        }
                                    >
                                        { breadcrumb.name }
                                    </div>
                                </NavLink>
                                { index !== loaderData.data.breadcrumbs.length - 1 && (
                                    <div className="flex items-center px-0.5 text-xs text-gray-800">
                                        <TbChevronRight className="inline" strokeWidth={3} />
                                    </div>
                                ) }
                            </React.Fragment>
                        )) }
                    </div>
                ) }
                <div className="space-y-0">
                    <div className="flex items-center gap-2.5 text-lg text-gray-800 font-bold tracking-tight">
                        <span>{ loaderData.data.header.title }</span>
                        <div>
                            { loaderData.data.masonry["2"].length > 0 && (
                                <span className="px-1.5 py-0.5 text-[10px] bg-sky-100 text-sky-600 rounded">{ loaderData.data.masonry["2"].length } products found</span>
                            ) }
                        </div>
                    </div>
                    <div className="text-xs text-gray-400">{ loaderData.data.header.subtitle }</div>
                </div>
                { loaderData.data.header.categories.length > 0 && (
                    <div className="grid grid-cols-4 gap-5 pb-8">
                        { loaderData.data.header.categories.map(category => (
                            <div key={category.id} className="space-y-1" onClick={handleOnNavigateCategoryChildren(category.id)}>
                                { category.imageUrl ? (
                                    <img className="aspect-video object-cover rounded-lg" src={category.imageUrl} />
                                ) : (
                                    <div className="aspect-video bg-gray-100 rounded-lg" />
                                ) }
                                <div className="text-sm font-medium tracking-tight">{ category.name }</div>
                            </div>
                        )) }
                    </div>
                ) }
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-400">Sort by: </div>
                        {/* <SelectField
                            data={[
                                { label: "Latest", value: "latest" },
                                { label: "Popular", value: "popular" }
                            ]}
                            defaultValue="latest"
                        /> */}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-400">Items per page: </div>
                        <div className="px-3 flex items-center gap-3">
                            <div className="text-sm text-indigo-600 font-semibold tracking-tight">12</div>
                            <div className="text-sm text-indigo-600 font-semibold tracking-tight">24</div>
                            <div className="text-sm text-indigo-600 font-semibold tracking-tight">36</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    { loaderData.data.filter.store && (
                        <div className="h-8 text-xs flex items-center justify-center bg-gray-100 rounded-lg">
                            <div className="pl-3">{ loaderData.data.filter.store.fullname }</div>
                            <Button className="size-6 lg:size-6 m-1" type="button" variant="ghost" size="icon" onPress={handleOnRemoveFilter("store")}>
                                <TbX />
                            </Button>
                        </div>
                    ) }
                    { loaderData.data.filter.category && (
                        <div className="h-8 text-xs flex items-center justify-center bg-gray-100 rounded-lg">
                            <div className="pl-3">{ loaderData.data.filter.category.name }</div>
                            <Button className="size-6 lg:size-6 m-1" type="button" variant="ghost" size="icon" onPress={handleOnRemoveFilter("category")}>
                                <TbX />
                            </Button>
                        </div>
                    ) }
                    { loaderData.data.filter.brand && (
                        <div className="h-8 text-xs flex items-center justify-center bg-gray-100 rounded-lg">
                            <div className="pl-3">{ loaderData.data.filter.brand.name }</div>
                            <Button className="size-6 lg:size-6 m-1" type="button" variant="ghost" size="icon" onPress={handleOnRemoveFilter("brand")}>
                                <TbX />
                            </Button>
                        </div>
                    ) }
                </div>
                <Masonry masonry={loaderData.data.masonry} />
            </div>
        </div>
    );
};

export default Page;