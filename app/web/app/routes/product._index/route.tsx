import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaThumbsUp } from "react-icons/fa6";
import { TbBuildingStore } from "react-icons/tb";
import { AiOutlineExclamationCircle, AiOutlineMessage } from "react-icons/ai";
import { redirect, useFetcher, useLoaderData, Form, useSearchParams, NavLink } from "@remix-run/react";
import { RemixFormProvider, getValidatedFormData, useRemixForm } from "remix-hook-form";
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

import { cn } from "~/components/utils";
import Button from "~/components/Button";

import { prisma } from "~/services/db.server";
import { queryString } from "~/services/queryString.server";
import { validationError } from "~/services/response.server";

import QuantityField from "./QuantityField";
import Carousel from "~/components/Carousel";

const validationSchema = z.object({
    id: z.string().uuid()
});

export const action = async ({ request }: ActionFunctionArgs) => {
    const result = await getValidatedFormData(request, zodResolver(validationSchema));

    if (result.errors) return validationError(result.errors, result.receivedValues);

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
            }),
            quantity: z.coerce.number().default(1),
        }).passthrough()
    );

    if (parsedQueryString.error) return redirect("/product/error?type=product-id-malformed");

    const { id, quantity, ...variants } = parsedQueryString.data;

    const product = await prisma.product.findFirst({
        where: { id },
        include: {
            images: {
                orderBy: {
                    sort: "asc"
                }
            },
            category: true,
            store: {
                include: {
                    deliveryOptions: {
                        include: {
                            option: true,
                            destination: true
                        },
                        orderBy: {
                            sort: "asc"
                        }
                    }
                }
            },
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

    const options = product.variants.map(variant =>
		variant.options.find(option => variants[variant.id] === option.id) ?? null
	);
	
	const inventory = !options.includes(null) ? await prisma.inventory.findFirst({
		where: {
			productId: product.id,
			AND: options.filter(Boolean).map(option => ({
				skus: {
					some: {
						optionId: option.id,
						variantId: option.variantId,
						productId: product.id
					}
				}
			}))
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
	}) : null;

    return {
        type: "success" as const,
        data: {
            product,
            inventory,
            quantity,
        }
    };
};

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
    const sku = loaderData.data.inventory ? `${loaderData.data.product.name} / ${loaderData.data.inventory.skus.map(sku => sku.option.name).join(" / ")}` : null;
    const stock = loaderData.data.inventory?.stocks.reduce((acc, stock) => acc + stock.quantity, 0) ?? 0;
    const quantity = loaderData.data.quantity;
    const salePricing = loaderData.data.inventory ? ((loaderData.data.product.salePrice + (loaderData.data.inventory.salePrice ?? 0) * quantity) / 100).toFixed(2) : null;
    const retailPricing = loaderData.data.inventory ? ((loaderData.data.product.retailPrice + (loaderData.data.inventory.retailPrice ?? 0) * quantity) / 100).toFixed(2) : null;
    const discountedPricing = loaderData.data.inventory ? (((loaderData.data.product.retailPrice + (loaderData.data.inventory.retailPrice ?? 0) - (loaderData.data.product.salePrice + (loaderData.data.inventory.salePrice ?? 0))) * quantity) / 100).toFixed(2) : null;

    const handleOnSelectOption = (variantId: string, optionId: string) => () => {
        setSearchParams(param => {
            param.set(variantId, optionId);

            return param;
        }, { replace: true, preventScrollReset: true });
    };

    console.log(loaderData.data.inventory);
    return (
        <React.Fragment>
            <div className="container mx-auto flex flex-col xl:flex-row gap-4 xl:gap-10">
                <div className="flex-[2.5]">
                    <Carousel images={loaderData.data.product.images} imageId={loaderData.data.inventory?.imagePointerId} />
                    {/* <div className="space-y-3">
                        <div className="size-full aspect-square bg-gray-200 animate-pulse xl:rounded-xl" />
                        <div className="hidden xl:flex gap-3">
                            <div className="flex-1 aspect-square bg-gray-200 rounded-lg">
                                <div className="size-full "></div>
                            </div>
                            <div className="flex-1 aspect-square bg-gray-200 rounded-lg">
                                <div className="size-full "></div>
                            </div>
                            <div className="flex-1 aspect-square bg-gray-200 rounded-lg">
                                <div className="size-full "></div>
                            </div>
                            <div className="flex-1 aspect-square bg-gray-200 rounded-lg">
                                <div className="size-full "></div>
                            </div>
                        </div>
                    </div> */}
                </div>
                <div className="px-4 xl:p-0 flex-[3.5]">
                    <RemixFormProvider { ...methods }>
                        <Form onSubmit={methods.handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <div className="text-xs text-gray-400">{ loaderData.data.product.category.name }</div>
                                <div className="text-xl font-semibold tracking-tight">{ loaderData.data.product.name }</div>
                                { sku && (
                                    <div className="text-xs text-gray-400">{ sku }</div> 
                                ) }
                            </div>
                            { (sku && stock <= 0) ? (
                                <div className="flex gap-2 bg-red-100 p-2 text-sm text-red-600 font-semibold tracking-tight ring-1 ring-red-300 rounded-lg">
                                    <span className="pt-0.5"><AiOutlineExclamationCircle /></span>
                                    <span>Sorry, the item you have selected ({ sku }) is currently out of stock.</span>
                                </div>
                            ) : (sku && loaderData.data.quantity > stock) ? (
                                <div className="flex gap-2 bg-red-100 p-2 text-sm text-red-600 font-semibold tracking-tight ring-1 ring-red-300 rounded-lg">
                                    <span className="pt-0.5"><AiOutlineExclamationCircle /></span>
                                    <span>Sorry, the quantity you selected is unavailable. You can only order up to { stock } units of stock due to limited availability.</span>
                                </div>
                            ) : !sku ? (
                                <div className="flex gap-2 bg-red-100 p-2 text-sm text-red-600 font-semibold tracking-tight ring-1 ring-red-300 rounded-lg">
                                    <span className="pt-0.5"><AiOutlineExclamationCircle /></span>
                                    <span>Sorry, the item you have selected is currently not available.</span>
                                </div>
                            ) : null }
                            <div>
                                { salePricing && retailPricing && (
                                    retailPricing !== salePricing ? (
                                        <div>
                                            <div className="text-[10px] text-gray-300 line-through">
                                                <span>B$ </span>
                                                <span>{ retailPricing }</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-gray-900">
                                                    <span className="text-xs text-gray-600">B$ </span>
                                                    <span className="text-lg font-bold tracking-tight">{ salePricing }</span>
                                                </div>
                                                <div className="px-2.5 py-1 bg-red-600 text-xs text-white font-semibold tracking-tight select-none rounded">Save ${ discountedPricing }</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-900">
                                            <span className="text-xs text-gray-600">B$ </span>
                                            <span className="text-lg font-bold tracking-tight">{ salePricing }</span>
                                        </div>
                                    )
                                ) }
                            </div>
                            <div className="space-y-3">
                                { loaderData.data.product.variants.map(variant => (
                                    <div key={variant.id} className="space-y-1">
                                        <div className="text-sm text-gray-800 font-semibold tracking-tight">{ variant.name }</div>
                                        <div className="flex items-center gap-3">
                                            { variant.options.map(option => (
                                                <div
                                                    key={option.id}
                                                    className={
                                                        cn(
                                                            "h-12 xl:h-10 px-3 text-sm text-gray-300 font-semibold tracking-tight flex items-center ring-1 ring-gray-200 rounded-lg cursor-pointer transition",
                                                            { "text-gray-900 ring-2 ring-indigo-600": searchParams.get(variant.id) === option.id }
                                                        )
                                                    }
                                                    onClick={handleOnSelectOption(variant.id, option.id)}
                                                >
                                                    { option.name }
                                                </div>
                                            )) }
                                        </div>
                                    </div>
                                )) }
                            </div>
                            <QuantityField quantity={quantity} stock={stock} />
                            <div className="hidden xl:flex gap-4">
                                <Button variant="ghost" className="bg-gray-100" isDisabled={stock < quantity} fullWidth>Add to cart</Button>
                                <Button isDisabled={stock < quantity} fullWidth>Buy now</Button>
                            </div>
                        </div>
                        </Form>
                    </RemixFormProvider>
                </div>
                <div className="px-4 xl:p-0 flex-[2.75] space-y-10">
                    <div className="space-y-2">
                        <div className="text-xs text-gray-900 font-semibold tracking-tighter uppercase">Delivery options</div>
                        {/* <select className="h-12 px-3 text-sm bg-gray-50 rounded-lg outline-none focus-within:ring-2 ring-indigo-600">
                            { loaderData.data.product.store.deliveryOptions.map(deliveryOption => (
                                <option key={deliveryOption.id}>
                                    <div>
                                        <span>{ deliveryOption.option.name }</span>
                                        <span> to </span>
                                        <span>{ deliveryOption.destination.name }</span>
                                        <span> - </span>
                                        <span>{ `B$${(deliveryOption.charges / 100).toFixed(2)}` }</span>
                                    </div>
                                </option>
                            )) }
                        </select> */}
                    </div>
                    <div className="space-y-3">
                        <div className="text-xs text-gray-900 font-semibold tracking-tighter uppercase">Seller information</div>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-1 items-center gap-3">
                                <span className="text-sm text-gray-900 font-semibold tracking-tight">{ loaderData.data.product.store.fullname }</span>
                                <div className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-xs text-green-600 font-semibold tracking-tight rounded">
                                    <FaThumbsUp />
                                    <span>99%</span>
                                </div>
                            </div>
                            <NavLink to={`/products?storeId=${loaderData.data.product.storeId}`}>
                                <Button variant="link">Visit store</Button>
                            </NavLink>
                        </div>
                        <div className="flex justify-around gap-3">
                            <div className="flex flex-1 items-center justify-center bg-gray-50 rounded-lg">
                                <div className="py-2">
                                    <span className="text-xs text-gray-500">Sold </span>
                                    <span className="text-lg font-semibold">54</span>
                                </div>
                            </div>
                            <div className="flex flex-1 items-center justify-center bg-gray-50 rounded-lg">
                                <div className="py-2">
                                    <span className="text-xs text-gray-500">Rated </span>
                                    <span className="text-lg font-semibold">99%</span>
                                </div>
                            </div>
                            <div className="flex flex-1 items-center justify-center bg-gray-50 rounded-lg">
                                <div className="py-2">
                                    <span className="text-xs text-gray-500">Seller </span>
                                    <span className="text-lg font-semibold">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sticky bottom-0 p-4 bg-white bg-opacity-80 backdrop-blur flex xl:hidden gap-4">
                <NavLink to={`/products?store=${loaderData.data.product.storeId}`}>
                    <Button variant="ghost" size="icon">
                        <TbBuildingStore />
                    </Button>
                </NavLink>
                <Button variant="ghost" size="icon">
                    <AiOutlineMessage />
                </Button>
                <Button variant="ghost" className="bg-gray-100" isDisabled={stock < quantity} fullWidth>Add to cart</Button>
                <Button isDisabled={stock < quantity} fullWidth>Buy now</Button>
            </div>
        </React.Fragment>
    );
};

export default Page;