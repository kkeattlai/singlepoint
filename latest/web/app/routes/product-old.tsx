import React from "react";
import { z } from "zod";
import { withZod } from "@rvf/zod";
import { Toaster, toast } from "sonner";
import { TbBuildingBank, TbHeart, TbHeartFilled, TbMessage, TbShare } from "react-icons/tb";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { FormProvider, useForm, validationError } from "@rvf/remix";

import Button from "~/components/Button";
import Carousel from "~/components/Carousel";
import ComboBox from "~/components/Form/ComboBox";
import TextField from "~/components/Form/TextField";
import IconButton from "~/components/IconButton";
import SelectField from "~/components/Form/SelectField";
import { prisma } from "~/services/db.server";
import { queryString } from "~/services/queryString.server";
import { getCategoryParent } from "~/prisma/rawQuery";
import { isError, isSuccess } from "~/utils";
import { useFavourite } from "~/services/favourite.server";
import { Label, ListBox, ListBoxItem, Popover, Select, SelectValue } from "react-aria-components";

const validationSchema = z.object({
    id: z.string(),
    _action: z.enum([ "addToFavourite", "removeFromFavourite" ]),
});

export const action = async ({ request }: ActionFunctionArgs) => {
    const result = await withZod(validationSchema).validate(await request.formData());

    if (result.error) return validationError(result.error, result.submittedData);

    const { id, _action } = result.data;

    if (_action === "addToFavourite") {
        const favourites = await useFavourite.parse(request);

        const product = await prisma.product.findFirst({
            where: { id }
        });

        if (!product) {
            return {
                type: "error" as const,
                error: {
                    message: "The provided product id is invalid. Please try again."
                }
            };
        }

        return json({
            type: "success" as const,
            data: {
                type: "create" as const,
                message: `${product.name} has been added to the favourite list.`
            }
        }, {
            headers: [
                await useFavourite.create([ ...favourites.filter(favourite => favourite.id !== product.id), { id: product.id } ])
            ]
        });
    }

    if (_action === "removeFromFavourite") {
        const favourites = await useFavourite.parse(request);

        const product = await prisma.product.findFirst({
            where: { id }
        });

        if (!product) {
            return {
                type: "error" as const,
                error: {
                    message: "The provided product id is invalid. Please try again."
                }
            };
        }

        return json({
            type: "success" as const,
            data: {
                type: "remove" as const,
                message: `${product.name} has been removed to the favourite list.`
            }
        }, {
            headers: [
                await useFavourite.create([ ...favourites.filter(favourite => favourite.id !== product.id) ])
            ]
        });
    }

    return {};
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const favourites = await useFavourite.parse(request);
    const parsedQueryString = await queryString.safeParse(request,
        z.object({
            id: z.string(),
            quantity: z.coerce.number().default(1),
            destinationId: z.string().optional()
        }).passthrough()
    );

    if (parsedQueryString.error) return redirect("/product/error?type=product-id-malformed");

    const { id, quantity, destinationId, ...variants } = parsedQueryString.data;
    
    const product = await prisma.product.findFirst({
        where: { id },
        include: {
            category: true,
            brand: true,
            images: true,
            variants: {
                include: {
                    options: true
                }
            }
        }
    });
    
    if (!product) return redirect("/product/error?type=invalid-id");
    
    const categoryParentIds = (await getCategoryParent(product.categoryId)).map(category => category.id);

    const destinations = await prisma.district.findMany({
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
    });

    const options = product.variants.map(variant =>
		variant.options.find(option => variants[variant.id] === option.id) ?? null
	);

    // console.log(await prisma.storeDeliveryOption.findMany({
    //     where: {
    //         storeId: product.storeId,
    //         districtId: destinationId ?? destinations[0]?.id ?? "0",
    //     },
    //     include: {
    //         // destination: true,
    //         option: true
    //     },
    //     orderBy: {
    //         sort: "asc"
    //     }
    // }));

    console.log("loader");

    return {
        type: "success" as const,
        data: {
            breadcrumb: await prisma.category.findMany({
                where: {
                    id: { in: categoryParentIds }
                },
                orderBy: {
                    sort: "asc"
                }
            }),
            product: {
                ...product,
                isFavourite: favourites.some(favourite => favourite.id === product.id)
            },
            inventory: !options.includes(null) ? await prisma.inventory.findFirst({
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
            }) : null,
            deliveryOptions: {
                destinations,
                options: await prisma.storeDeliveryOption.findMany({
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
                })
            }
            // storeDeliveryOptions: await prisma.storeDeliveryOption.findMany({
            //     where: { 
            //         storeId: product.storeId
            //     },
            //     include: {
            //         destination: true,
            //         option: true,
            //     }
            // })
        }
    };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const fetcher = useFetcher<typeof action>();
    const loaderData = useLoaderData<typeof loader>();
    const form = useForm({
        method: "POST",
        fetcher,
        validator: withZod(validationSchema),
        defaultValues: {
            id: loaderData.data.product.id,
            destinationId: searchParams.get("destinationId") ?? loaderData.data.deliveryOptions.destinations[0]?.id,
            optionId: loaderData.data.deliveryOptions.options[0]?.option.id
        },
        submitSource: "state"
    });

    // console.log({
    //     id: loaderData.data.product.id,
    //     destinationId: loaderData.data.deliveryOptions.destinations[0]?.id,
    //     optionId: loaderData.data.deliveryOptions.options[0]?.option.id
    // });

    console.log("rerender");

    // console.log(
    //     loaderData.data.deliveryOptions.options
    // );

    React.useEffect(() =>
        form.subscribe.value("destinationId", value => {
            console.log(value);
            setSearchParams(param => {
                param.set("destinationId", value)

                return param;
            });
        })
    , []);

    React.useEffect(() => {
        isError(fetcher.data) && toast.error(fetcher.data.error.message);

        if (isSuccess(fetcher.data)) {
            fetcher.data.data.type === "create" && toast.success(fetcher.data.data.message);
            fetcher.data.data.type === "remove" && toast.warning(fetcher.data.data.message);
        }
    }, [ fetcher.data ]);

    console.log(loaderData.data.deliveryOptions.options[0]);

    return (
        <FormProvider scope={form.scope()}>
            <fetcher.Form { ...form.getFormProps() }>
                <TextField name="id" />
                <TextField name="optionId" />
                <div className="container mx-auto flex gap-10">
                    <div className="flex-[33%]">
                        <Carousel images={loaderData.data.product.images} thumbPadding="p-3" />
                    </div>
                    <div className="flex-[33%] p-4 md:p-0">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                {/* <div className="text-xs text-gray-400 font-medium tracking-tight">{ loaderData.data.breadcrumb.map(category => category.name).join(" / ") }</div> */}
                                <div className="text-xs text-gray-400 font-medium tracking-tight">{ loaderData.data.product.brand?.name }</div>
                                <div className="text-lg font-semibold tracking-tight">{ loaderData.data.product.name }</div>
                                <div className="text-xs text-gray-400 font-medium tracking-tight flex gap-0.5">
                                    <div>SKU: </div>
                                    <div className="flex">
                                        <div>{ loaderData.data.product.name }</div>
                                        { loaderData.data.inventory && (
                                            <div>/{ loaderData.data.inventory.skus.map(sku => sku.option.name).join("/") }</div>
                                        ) }
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                { !loaderData.data.product.isFavourite ? (
                                    <IconButton type="submit" name="_action" value="addToFavourite">
                                        <TbHeart />
                                    </IconButton>
                                ) : (
                                    <IconButton type="submit" name="_action" value="removeFromFavourite">
                                        <TbHeartFilled />
                                    </IconButton>
                                ) }
                                <IconButton type="submit" name="_action" value="sharePost">
                                    <TbShare />
                                </IconButton>
                            </div>
                        </div>
                        <div className="space-y-4">
                            { loaderData.data.product.variants.map(variant => (
                                <div key={variant.id}>
                                    <div className="text-xs text-gray-500 font-medium tracking-tight">{ variant.name }</div>
                                    { variant.options.map(option => (
                                        <div key={option.id}>{ option.name }</div>
                                    )) }
                                </div>
                            )) }
                        </div>
                    </div>
                    <div className="flex-[33%]">
                        <SelectField.Base
                            name="destinationId"
                            items={loaderData.data.deliveryOptions.destinations}
                            fullWidth
                        >
                            { item => (
                                <SelectField.Item>{ item.name }</SelectField.Item>
                            ) }
                        </SelectField.Base>
                        <SelectField.Base
                            name="optionId"
                            items={loaderData.data.deliveryOptions.options}
                            fullWidth
                        >
                            { item => (
                                <SelectField.Item id={item.option.id}>{ `${item.option.name}(${item.charges})` }</SelectField.Item>
                            ) }
                        </SelectField.Base>
                        {/* <select
                            { ...form.getInputProps("destinationId", { className: "h-12 md:h-10 text-sm rounded-lg ring-1 ring-gray-200" }) }
                        >
                            { loaderData.data.deliveryOptions.destinations.map(destination => (
                                <option key={destination.id} value={destination.id}>{ destination.name }</option>
                            )) }
                        </select>
                        <select { ...form.getInputProps("optionId") }>
                            { loaderData.data.deliveryOptions.options.map(option => (
                                <option key={option.option.id} value={option.option.id}>{ `${option.option.name}(${option.charges})` }</option>
                            )) }
                        </select> */}
                        {/* <Select { ...form.getInputProps("destinationId") }
                            className="h-12 w-[110px] bg-red-100"
                            defaultSelectedKey={loaderData.data.deliveryOptions.destinations[0].id}
                        >
                            <Label>Favorite Animal</Label>
                            <Button>
                                <SelectValue />
                                <span aria-hidden="true">▼</span>
                            </Button>
                            <Popover>
                                <ListBox>
                                    { loaderData.data.deliveryOptions.destinations.map(destination => (
                                        // <option key={destination.id} value={destination.id}>{ destination.name }</option>
                                        <ListBoxItem id={destination.id}>{ destination.name }</ListBoxItem>        
                                    )) }
                                </ListBox>
                            </Popover>
                        </Select> */}
                        {/* <TextField name="destinationId"></TextField> */}
                        {/* <ComboBox.Base
                            name="destinationId"
                            defaultItems={loaderData.data.deliveryOptions.destinations.map(destination => ({
                                id: destination.id,
                                label: destination.name,
                                value: destination.name
                            }))}
                        >
                            { item => (
                                <ComboBox.Item key={item.id} value={item}>{ item.label }</ComboBox.Item>
                            ) }
                        </ComboBox.Base>
                        <ComboBox.Base
                            name="optionId"
                            defaultItems={loaderData.data.deliveryOptions.options.map(option => ({
                                id: option.option.id,
                                label: option.option.name,
                                value: option.option.name,
                                charges: option.charges
                            }))}
                            defaultSelectedKey={loaderData.data.deliveryOptions.options[0]?.option.id}
                        >
                            { item => (
                                <ComboBox.Item key={item.id} value={item}>{ `${item.value}(${item.charges})` }</ComboBox.Item>
                            ) }
                        </ComboBox.Base> */}
                        {/* <ComboBox.Base name="optionId">
                            { loaderData.data.deliveryOptions.options.map(option => (
                                <ComboBox.Item>{ option.option.name }({ option.charges })</ComboBox.Item>
                            )) }
                        </ComboBox.Base> */}
                    </div>
                </div>
                <div className="md:hidden fixed bottom-0 inset-x-0 flex items-center gap-6 p-3 bg-white backdrop-blur-2xl border-t border-gray-100">
                    <div className="flex gap-3">
                        <IconButton>
                            <TbBuildingBank />
                        </IconButton>
                        <IconButton>
                            <TbMessage />
                        </IconButton>
                    </div>
                    <Button fullWidth>Add to cart</Button>
                </div>
                <Toaster richColors closeButton />
            </fetcher.Form>
        </FormProvider>
    );
};

export default Page;