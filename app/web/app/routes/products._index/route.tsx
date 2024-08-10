import React from "react";
import queryStringParser from "query-string";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { z } from "zod";
import { TbChevronDown } from "react-icons/tb";
import { ClientOnly } from "remix-utils/client-only";
import { NavLink, useLoaderData, useNavigate, useRouteLoaderData, useSearchParams } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@remix-run/node";

import { prisma } from "~/services/db.server";
import { queryString } from "~/services/queryString.server";

import Image from "~/components/Image";
import Button from "~/components/Button";
import { cn } from "~/components/utils";
import { getCategoryLeaf, getCategoryParent } from "~/prisma/rawQuery";

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
    
    // const category = await prisma.category.findMany({
    //     include: {
    //         _count: {
    //             select: {
    //                 products: {
    //                     where: {
    //                         AND: [
    //                             ...(parsedQueryString.data?.storeId) ? [
    //                                 { storeId: parsedQueryString.data.storeId }
    //                             ] : [],
    //                             // ...(parsedQueryString.data?.categoryId) ? [
    //                             //     { categoryId: { in: categoryLeafIds } }
    //                             // ] : [],
    //                             ...(parsedQueryString.data?.brandId) ? [
    //                                 { brandId: parsedQueryString.data.brandId }
    //                             ] : []
    //                         ]
    //                     },
    //                 }
    //             }
    //         }
    //     },
    //     orderBy: {
    //         sort: "asc"
    //     }
    // });

    return {
		type: "success" as const,
		data: {
			...parsedQueryString.success ? {
				...parsedQueryString.data.storeId ? {
                    store: await prisma.store.findFirst({
                        where: { id: parsedQueryString.data.storeId }
                    }),
                } : {},
                ...parsedQueryString.data.categoryId ? {
                    category: await prisma.category.findFirst({
                        where: {
                            id: parsedQueryString.data.categoryId
                        }
                    }),
                } : {},
            } : {},
            count: await prisma.product.count({
                where: { categoryId: { in: categoryLeafIds } }
            }) ?? 0,
            categories: {
                breadcrumbs: categoryParentIds,
                // all: recursive(category, null),
                // children: category.filter(category => category.parent === parsedQueryString.data?.categoryId)
                children: await Promise.all((await prisma.category.findMany({
                    where: {
                        parent: parsedQueryString.data?.categoryId ?? null,
                    },
                    orderBy: {
                        sort: "asc"
                    }
                })).map(async category => ({
                    ...category,
                    _count: {
                        products: await prisma.product.count({
                            where: {
                                categoryId: { in: (await getCategoryLeaf(category.id)).map(category => category.id) }
                            }
                        })
                    }
                }))),
            },
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
            products: await prisma.product.findMany({
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
            })
		}
	};
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();
    const loaderData = useLoaderData<typeof loader>();

    const handleOnNavigateProduct = (product: NonNullable<typeof loaderData.data.products>[number]) => () => {
        const searchParams = product.variants.filter(variant => variant.options.length > 0).map(variant => {
            return { [ variant.id ]: variant.options[0].id };
        }).reduce((acc, variant) => ({ ...acc, ...variant }), {});

        const queryString = queryStringParser.stringify(searchParams);

        navigate(`/product?id=${product.id}${queryString ? `&${queryString}` : ""}`);
    };

    const handleOnGoBack = () => {
        navigate(-1);
    };

    return (
                <div>
                    <div className="flex flex-col gap-5">
                        <div className="space-y-3">
                            { !!searchParams.get("categoryId") && (
                                <div className="flex items-center gap-2 px-4 lg:px-0">
                                    <NavLink to={`/products`}>
                                        <span
                                            className={
                                                cn(
                                                    "text-xs text-sky-600 cursor-pointer hover:underline",
                                                    { "text-gray-000 font-semibold tracking-tight hover:no-underline pointer-events-none": !!!searchParams.get("categoryId") }
                                                )
                                            }
                                        >Home</span>
                                    </NavLink>
                                    <span className="text-xs">/</span>
                                    { loaderData.data.categories.breadcrumbs.map((breadcrumb, index) => (
                                        <React.Fragment key={index}>
                                            <NavLink to={`/products?categoryId=${breadcrumb.id}`}>
                                                <span
                                                    key={breadcrumb.id}
                                                    className={
                                                        cn(
                                                            "text-xs text-sky-600 cursor-pointer hover:underline",
                                                            { "text-gray-000 font-semibold tracking-tight hover:no-underline pointer-events-none": searchParams.get("categoryId") === breadcrumb.id }
                                                        )
                                                    }
                                                >{ breadcrumb.name }</span>
                                            </NavLink>
                                            { index !== loaderData.data.categories.breadcrumbs.length - 1 && (
                                                <span className="text-xs">/</span>
                                            ) }
                                        </React.Fragment>
                                    )) }
                                </div>
                            ) }
                            { loaderData.data.store ? (
                                <div className="px-4 lg:px-0">
                                    <div className="text-lg font-semibold tracking-tight">{ loaderData.data.store.fullname }</div>
                                    <div className="text-xs text-gray-500">{ loaderData.data.store.description }</div>
                                </div>
                            ) : loaderData.data.category ? (
                                <div className="px-4 lg:px-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-semibold tracking-tight">{ loaderData.data.category.name }</span>
                                        { loaderData.data.count > 0 && (
                                            <div className="px-2 py-0.5 text-[10px] bg-sky-100 text-sky-600 rounded">{ loaderData.data.count } products found</div>
                                        ) }
                                    </div>
                                    <div className="text-xs text-gray-500">{ loaderData.data.category.description }</div>
                                </div>
                            ) : (
                                <div className="px-4 lg:px-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-semibold tracking-tight">Home</span>
                                    </div>
                                    <div className="text-xs text-gray-500">Discover the ultimate shopping experience at Singlepoint, where convenience meets variety. As a leading ecommerce platform, Singlepoint offers an extensive range of products, competitive prices, and exceptional customer service, making it the perfect destination for all your shopping needs.</div>
                                </div>
                            ) }
                        </div>
                        <div className="flex flex-nowrap px-4 lg:px-0 no-scrollbar lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-3 overflow-x-scroll lg:overflow-auto">
                            { loaderData.data.categories.children.map(category => (
                                category._count.products >= 0 && (
                                    <div key={category.id} className="flex-none w-[65%] md:w-[43%] lg:w-full">
                                        <NavLink to={`/products?categoryId=${category.id}`} className="space-y-1">
                                            <Image className="w-full aspect-video rounded-lg" src={category.imageUrl} />
                                            <div className="outline-none focus:ring-2 ring-offset-2 ring-indigo-600 rounded">
                                                <div className="lg:text-sm px-0.5 font-semibold tracking-tight">{ category.name }</div>                                    
                                            </div>
                                        </NavLink>
                                    </div>
                                )
                            )) }
                        </div>
                    </div>
                    <div className="px-4 lg:px-0 flex flex-col gap-3">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-600">Sort by: </span>
                                <span className="text-sm text-indigo-600">Popularity</span>
                                <span className="text-xs text-indigo-600">
                                    <TbChevronDown />
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">Items per page: </span>
                                <span className="text-sm text-indigo-600 font-bold tracking-tight cursor-pointer hover:underline">16</span>
                                <span className="text-sm text-gray-400">32</span>
                                <span className="text-sm text-gray-400">48</span>
                            </div>
                        </div>
                        <ClientOnly>
                            { () => (
                                loaderData.data.products.length <= 0 ? (
                                    <div className="w-full h-80 bg-gray-50 flex flex-col items-center py-20 gap-6 rounded-lg">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="text-xl text-gray-900 font-bold tracking-tight">No products found</div>
                                            <div className="text-xs text-gray-400">Discover more products by clicking the button below</div>
                                        </div>
                                        <div className="flex gap-8">
                                            <NavLink to="/products">
                                                <Button>Shop more</Button>
                                            </NavLink>
                                            <Button type="button" variant="ghost" onClick={handleOnGoBack}>Go back</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <ResponsiveMasonry className="pb-10" columnsCountBreakPoints={{ 640: 2, 768: 3, 1280: 4 }}>
                                        <Masonry gutter="16px">
                                            { loaderData.data.products.map(product => (
                                                <div key={product.id} className="space-y-1" onClick={handleOnNavigateProduct(product)}>
                                                    <Image src={product.images[0]?.url} />
                                                    <div>
                                                        <div className="text-sm text-gray-800 font-medium tracking-tight">{ product.name }</div>
                                                        <div className="text-gray-700">
                                                            { product.variants.length >= 0 && (
                                                                <span className="text-xs">From </span>
                                                            ) }
                                                            <span className="text-[10px] text-gray-500">B$</span>
                                                            <span className="text-xs font-medium tracking-tight">{ (product.salePrice / 100).toFixed(2) }</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) }
                                        </Masonry>
                                    </ResponsiveMasonry>
                                )
                            ) }
                        </ClientOnly>
                    </div>
                </div>
        //     </div>
        // </div>
    );
};

export default Page;