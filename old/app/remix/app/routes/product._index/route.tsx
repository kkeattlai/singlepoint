import React from "react";
import { z } from "zod";
import { withZod } from "@rvf/zod";
import { Toaster, toast } from "sonner";
import { validationError } from "@rvf/remix";
import { TbHeart, TbHeartFilled } from "react-icons/tb";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { RiShoppingBag4Line } from "react-icons/ri"

import Alert from "~/components/Alert";
import Button from "~/components/Button";
import { useCarousel, isError, isSuccess } from "~/utils";
import { cn } from "~/components/utils";
import { prisma } from "~/services/db.server";
import { useCart } from "~/services/cart.server";
import { queryString } from "~/services/queryString.server";
import { useFavourite } from "~/services/favourite.server";

import DeliveryInfo from "./DeliveryInfo";
import MerchantInfo from "./MerchantInfo";
import ProductDetailsAndReviews from "./ProductDetailsAndReviews";
import SimilarProducts from "./SimilarProducts";
import { getCategoryParent } from "~/prisma/rawQuery";

export const validationSchema = z.object({
    _action: z.enum([ "buyNow", "addToCart", "addToFavourite", "removeFromFavourite" ]),
    id: z.string(),
    inventoryId: z.string().optional(),
    quantity: z.coerce.number().default(1)
});

export const validator = withZod(validationSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
    const cart = await useCart.parse(request);
    const favourite = await useFavourite.parse(request);
    const result = await validator.validate(await request.formData());

    if (result.error) return validationError(result.error, result.submittedData);

    const { _action, id, inventoryId, quantity } = result.data;

    const product = await prisma.product.findFirst({
        where: { id }
    });

    if (!product) {
        return {
            type: "error" as const,
            error: {
                message: "Product not found. Unable to add cart.",
                details: []
            }
        };
    }

    if (_action === "addToFavourite") {
        return json({
            type: "success" as const,
            data: {
                type: "created" as const,
                message: "Item is added to favourite successfully."
            }
        }, {
            headers: [
                await useFavourite.create([ ...favourite.filter(favourite => favourite.id !== product.id), { id: product.id } ])   
            ]
        });
    }

    if (_action === "removeFromFavourite") {
        return json({
            type: "success" as const,
            data: {
                type: "deleted" as const,
                message: "Item is removed from favourite successfully."
            }
        }, {
            headers: [
                await useFavourite.create([ ...favourite.filter(favourite => favourite.id !== product.id) ])   
            ]
        });
    }

    const inventory = await prisma.inventory.findFirst({
        where: { id: inventoryId },
        include: {
            product: true,
            skus: {
                include: {
                    option: true,
                },
                orderBy: {
                    sort: "asc"
                }
            }
        }
    });

    if (!inventory) {
        return {
            type: "error" as const,
            error: {
                message: "Inventory not found. Unable to add cart.",
                details: []
            }
        };
    }

    if (_action === "buyNow") {
        return redirect("/shopping-cart", {
            headers: [
                await useCart.create([ ...cart.filter(cart => cart.inventoryId !== inventory.id), { inventoryId: inventory.id, quantity } ])
            ]
        });
    }

    return json({
        type: "success" as const,
        data: {
            type: "created" as const,
            message: `${inventory.product.name}${inventory.skus.length > 0 ? ` / ${inventory.skus.map(sku => sku.option.name).join(" / ")}` : ``} has been added to the cart.`
        }
    }, {
        headers: [
            await useCart.create([ ...cart.filter(cart => cart.inventoryId !== inventory.id), { inventoryId: inventory.id, quantity } ])
        ]
    });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const favourite = await useFavourite.parse(request);
    const parsedQueryString = await queryString.safeParse(request,
        z.object({
            id: z.string(),
            inventoryId: z.string().optional(),
            destinationId: z.string().optional(),
            deliveryMethodId: z.string().optional()
        }).passthrough()
    );

    if (parsedQueryString.error) return redirect("/product/error?type=invalid-id");

    const { id, inventoryId, destinationId, deliveryMethodId, ...rest } = parsedQueryString.data;

    const product = await prisma.product.findFirst({
        where: { id },
        include: {
            images: true,
            store: true,
            category: true,
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
                    sort: "asc",
                }
            },
        }
    });

    if (!product) return redirect("/product/error?type=not-found");

    const options = product.variants.map(variant =>
		variant.options.find(option => rest[variant.id] === option.id) ?? null
	);
    
    const [ inventory, destinations ] = await Promise.all([
        prisma.inventory.findFirst({
            where: {
                productId: product.id,
                AND: options.map(option => ({
                    skus: {
                        some: {
                            optionId: option?.id ?? "0",
                            variantId: option?.variantId ?? "0",
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
                }
            }
        }),
        prisma.district.findMany({
            where: {
                storeDeliveryOption: {
                    some: {
                        storeId: product.storeId
                    }
                }
            },
            orderBy: {
                sort: "asc"
            }
        }),
    ]);

    const categoryParentIds = (await getCategoryParent(product.categoryId)).reverse().map(category => ({ id: category.id, name: category.name })) || [];

    const deliveryMethods = await prisma.storeDeliveryOption.findMany({
        where: {
            storeId: product.storeId,
            districtId: destinationId ?? destinations[0]?.id ?? "0",
        },
        include: {
            destination: true,
            option: true
        },
        orderBy: {
            sort: "asc"
        }
    });

    return {
        type: "success" as const,
        data: {
            isFavourite: favourite.some(favourite => favourite.id === product.id),
            defaultValues: {
                destinationId: destinationId ?? destinations[0]?.id ?? undefined,
                deliveryMethodId: deliveryMethodId ?? deliveryMethods[0]?.option.id ?? undefined
            },
            delivery: {
                destinations,
                methods: deliveryMethods,
                info: await prisma.storeDeliveryOption.findFirst({
                    where: {
                        storeId: product.storeId,
                        districtId: destinationId ?? destinations[0]?.id ?? "0",
                        deliveryTypeId: deliveryMethodId ?? deliveryMethods[0]?.option.id ?? "0"
                    },
                    include: {
                        destination: true,
                        option: true
                    },
                    orderBy: {
                        sort: "asc"
                    }
                })
            },
            breadcrumb: categoryParentIds,
            product,
            inventory,
            similarProducts: await prisma.product.findMany({
                where: {
                    OR: categoryParentIds.map(categoryParentId => ({
                        categoryId: categoryParentId.id
                    }))
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
                },
                orderBy: {
                    category: {
                        sort: "desc"
                    }
                }
            })
        }
    };
};

type Image =  {
    id: string;
    url: string;
};

type CarouselProps = {
    images: Image[];
};

const Carousel: React.FC<CarouselProps> = ({ images }) => {
    const [ mainEmblaRef, mainEmblaApi ] = useCarousel();
    const [ imageSelectorEmblaRef, imageSelectorEmblaApi, { canScrollNext, canScrollPrev } ] = useCarousel();

    const handleOnScrollToIndex = (index: number) => () => {
        console.log(index);
        mainEmblaApi?.scrollTo(index);
    };

    console.log({ selectedSnap: (mainEmblaApi?.selectedScrollSnap() ?? 0) })

    return (
        <div className="space-y-2">
            <div className="overflow-hidden" ref={mainEmblaRef}>
                <div className="flex">
                    { images.map(image => (
                        <div key={image.id} className="mr-1 last:mr-0 bg-gray-100 flex-[0_0_100%] overflow-hidden lg:rounded-lg">
                            <img src={image.url} />
                        </div>
                    )) }
                </div>
            </div>
            <div className="overflow-hidden" ref={imageSelectorEmblaRef}>
                <div className="p-1 flex items-center gap-2">
                    { images.map((image, index) => (
                        <div
                            key={image.id}
                            className={
                                cn(
                                    "mr-2 last:mr-0 flex-[0_0_22.5%] aspect-square opacity-20 rounded-lg overflow-hidden cursor-pointer transition",
                                    { "opacity-100 ring-2 ring-indigo-600": (mainEmblaApi?.selectedScrollSnap() ?? 0) === index }
                                )
                            }
                            onClick={handleOnScrollToIndex(index)}
                        >
                            <img src={image.url} />
                        </div>
                    )) }
                </div>
            </div>
        </div>
    );
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const fetcher = useFetcher<typeof action>();
    const loaderData = useLoaderData<typeof loader>();
    const salePrice = (loaderData.data.product.salePrice + (loaderData.data.inventory?.salePrice ?? 0)) / 100;
    const retailPrice = (loaderData.data.product.retailPrice + (loaderData.data.inventory?.retailPrice ?? 0)) / 100;
    const discountPrice = retailPrice - salePrice;

    const handleOnSelectOption = (variantId: string, optionId: string) => () => {
        setSearchParams(param => {
            param.set(variantId, optionId);

            return param;
        }, { replace: true, preventScrollReset: true });
    };

    React.useEffect(() => {
        if (isSuccess(fetcher.data)) {
            fetcher.data.data.type === "created" && toast.success(fetcher.data.data.message);
            fetcher.data.data.type === "deleted" && toast.error(fetcher.data.data.message);
        };
    }, [ fetcher.data ]);

    React.useEffect(() => {
        if (isError(fetcher.data)) {
            toast.error(fetcher.data.error.message);
        };
    }, [ fetcher.data ]);

    return (
        <div className="container mx-auto space-y-8">
            <div className="flex flex-col md:flex-row lg:gap-3">
                <div className="w-full md:w-[42.5%] lg:w-[32.5%] xl:w-[29.5%] md:p-4">
                    {/* <Carousel images={loaderData.data.product.images} /> */}
                    {/* <div className="relative w-full bg-gray-100 md:rounded-lg">
                        <img
                            src={loaderData.data.product.images[0]?.url}
                        />
                    </div> */}
                    <Carousel images={[ ...loaderData.data.product.images, ...loaderData.data.product.images ].map((image, index) => ({ ...image, id: `${index}` }))} />
                </div>
                <div className="p-4 lg:p-2 xl:p-4 py-4 flex-[1.25] xl:flex-[1.5] space-y-10">
                    <div className="space-y-4">
                        <div className="space-y-0">
                            <div className="text-[11px] text-gray-400 uppercase">{ loaderData.data.product.category.name }</div>
                            <div className="space-y-0.5">
                                <div className="text-lg font-semibold tracking-tight">{ loaderData.data.product.name }</div>
                                <div className="text-xs text-gray-400">SKU: { loaderData.data.product.name }{ loaderData.data.inventory && ` / ${loaderData.data.inventory.skus.map(sku => sku.option.name).join(" / ")}` }</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div>
                                <span className="text-xs text-gray-400">B$</span>
                                <span className="text-xl font-semibold tracking-tight">{ salePrice.toFixed(2) }</span>
                            </div>
                            <div className="px-1.5 py-0.5 bg-red-600 text-[10px] text-white font-semibold tracking-tight rounded">You save B${ discountPrice.toFixed(2) }</div>
                        </div>
                        { loaderData.data.product.variants.map(variant => (
                            <div key={variant.id} className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="text-sm font-medium tracking-tight">{ variant.name }</div>
                                    <span className="text-[6px] text-gray-300">●</span>
                                    { variant.options.find(option => option.id === searchParams.get(variant.id)) ? (
                                        <div className="text-sm text-gray-500">{ variant.options.find(option => option.id === searchParams.get(variant.id))?.name }</div>
                                    ) : (
                                        <div className="text-sm text-gray-400">Please select an options for <span className="lowercase">{ variant.name }</span></div>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    { variant.options.map(option => (
                                        <div
                                            key={option.id}
                                            className={
                                                cn(
                                                    "h-12 md:h-10 px-3 flex items-center text-sm text-gray-200 tracking-tight ring-1 ring-gray-200 cursor-pointer rounded-lg transition",
                                                    { "text-gray-800 ring-2 ring-indigo-600": searchParams.get(variant.id) === option.id }
                                                )
                                            }
                                            onClick={handleOnSelectOption(variant.id, option.id)}
                                        >{ option.name }</div>
                                    )) }
                                </div>
                            </div>
                        )) }
                    </div>
                    <fetcher.Form method="POST">
                        <input className="hidden" name="id" value={loaderData.data.product.id} readOnly />
                        <input className="hidden" name="inventoryId" value={loaderData.data.inventory?.id} readOnly />
                        <input className="hidden" name="quantity" value={1} readOnly />
                        <div className="flex gap-3">
                            <Button name="_action" value="addToCart" leadingIcon={<RiShoppingBag4Line />} fullWidth="flex" isLoading={fetcher.state === "submitting"}>Add to cart</Button>
                            { !loaderData.data.isFavourite ? (
                                <Button name="_action" value="addToFavourite" variant="ghost" size="icon" color="secondary">
                                    <TbHeart />
                                </Button>
                            ) : (
                                <Button name="_action" value="removeFromFavourite" variant="ghost" size="icon" color="secondary">
                                    <TbHeartFilled />
                                </Button>
                            ) }
                        </div>
                        <Toaster richColors />
                    </fetcher.Form>
                </div>
                <div className="hidden lg:block flex-1 p-4 space-y-10">
                    <DeliveryInfo />
                    <MerchantInfo />
                </div>
            </div>
            <ProductDetailsAndReviews />
            <SimilarProducts />
        </div>
    );
};

export default Page;