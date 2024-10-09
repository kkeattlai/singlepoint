import React from "react";
import { z } from "zod";
import { Toaster } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbBuildingBank, TbHeart, TbHeartFilled, TbMessage, TbShare } from "react-icons/tb";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { FieldErrors, FieldValues } from "react-hook-form";

import { cn } from "~/components/utils";
import { prisma } from "~/services/db.server";
import { queryString } from "~/services/queryString.server";
import { useFavourite } from "~/services/favourite.server";
// import { getValidatedFormData, validationError } from "~/utils/index.server";
import Button from "~/components/Button";
import Carousel from "~/components/Carousel";
import IconButton from "~/components/Form/IconButton";
import BaseIconButton from "~/components/IconButton";
import TextField from "~/components/Form/TextField";
import { FormProvider, useForm, validationError } from "@rvf/remix";
import { withZod } from "@rvf/zod";

const validationSchema = z.object({
    id: z.string(),
    // destinationId: z.string(),
    _action: z.enum([ "addToFavourite", "removeFromFavourite" ])
}).passthrough();

const validator = withZod(validationSchema);

type ValidationSchema = z.infer<typeof validationSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
    const result = await validator.validate(await request.formData());
    
    if (result.error) return validationError(result.error, result.submittedData);

    const { id, _action } = result.data;

    console.log({ id, _action });

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
    console.log({ favourites });
    const parsedQueryString = await queryString.safeParse(request,
        z.object({
            id: z.string(),
            quantity: z.coerce.number().default(1),
            destinationId: z.string().optional()
        }).passthrough()
    );

    if (parsedQueryString.error) return redirect("/product/error?type=invalid-id");

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

    const options = product.variants.map(variant =>
		variant.options.find(option => variants[variant.id] === option.id) ?? null
	);
    const isValidOption = !options.includes(null);

    // console.log({ isFavourite: favourites.some(favourite => favourite.id === product.id) });
    // console.log("rerender");
    return {
        type: "success" as const,
        data: {
            product: {
                ...product,
                id: `${Math.random()}`,
                isFavourite: favourites.some(favourite => favourite.id === product.id)
            },
            inventory: isValidOption ? await prisma.inventory.findFirst({
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
            }) : null
        }
    };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const [ searchParam, setSearchParams ] = useSearchParams();
    const fetcher = useFetcher<typeof action>();
    const loaderData = useLoaderData<typeof loader>();
    const methods = useForm({
        method: "POST",
        fetcher,
        validator,
        // submitSource: "state",
        defaultValues: {
            id: loaderData.data.product.id
        } as ValidationSchema
    });

    // console.log(methods.getInputProps("id").ref);

    // methods.setValue("destinationId", "")
    const handleOnSelectOption = ({ variantId, optionId }: { variantId: string; optionId: string; }) => () => {
        setSearchParams(param => {
            param.set(variantId, optionId);

            return param;
        });
    };

    React.useEffect(() => {
        methods.setValue("id", loaderData.data.product.id);
    }, [ loaderData.data.product ]);

    return (
        <FormProvider scope={methods.scope()}>
            <fetcher.Form { ...methods.getFormProps() }>
                <input { ...methods.getInputProps("id") } />
                <TextField name="id" />
                <div className="container mx-auto flex gap-10">
                    <div className="flex-[33%]">
                        <Carousel images={loaderData.data.product.images} thumbPadding="p-3" />
                    </div>
                    <div className="flex-[33%] p-4 md:p-0 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                {/* <div className="text-xs text-gray-400 font-medium tracking-tight">{ loaderData.data.breadcrumb.map(category => category.name).join(" / ") }</div> */}
                                <div className="text-xs text-gray-400 font-medium tracking-tight">{ loaderData.data.product.brand?.name }</div>
                                <div className="text-lg font-semibold tracking-tight">{ loaderData.data.product.name }</div>
                                <div className="text-xs text-gray-400 tracking-tight flex gap-1.5">
                                    <div>SKU: </div>
                                    <div className="flex gap-1">
                                        <div>{ loaderData.data.product.name }</div>
                                        { loaderData.data.inventory && (
                                            <div> / { loaderData.data.inventory.skus.map(sku => sku.option.name).join(" / ") }</div>
                                        ) }
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                { !loaderData.data.product.isFavourite ? (
                                    <IconButton name="_action" value="addToFavourite">
                                        <TbHeart />
                                    </IconButton>
                                ) : (
                                    <IconButton name="_action" value="removeFromFavourite">
                                        <TbHeartFilled />
                                    </IconButton>
                                ) }
                                <IconButton name="_action" value="sharePost">
                                    <TbShare />
                                </IconButton>
                            </div>
                        </div>
                        <div className="space-y-4">
                            { loaderData.data.product.variants.map(variant => (
                                <div key={variant.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="text-sm text-gray-500">{ variant.name }</div>
                                        { variant.options.find(option => option.id === searchParam.get(variant.id)) ? (
                                            <div className="py-0.5 px-2 bg-slate-600 text-[10px] text-white font-medium tracking-tight rounded-md">{ variant.options.find(option => option.id === searchParam.get(variant.id))?.name ?? "" }</div>
                                        ) : (
                                            <div className="py-0.5 px-2 bg-red-700 text-[10px] text-white font-medium tracking-tight rounded-md">Please select an options for the variant.</div>
                                        ) }
                                    </div>
                                    <div className="flex items-center gap-2">
                                        { variant.options.map(option => (
                                            <div
                                                key={option.id}
                                                className={
                                                    cn(
                                                        "h-12 md:h-10 px-3 flex items-center text-sm text-gray-200 font-medium tracking-tight ring-1 ring-gray-200 cursor-pointer transition rounded-lg",
                                                        { "text-gray-800 ring-2 ring-indigo-600": option.id === searchParam.get(variant.id) }
                                                    )
                                                }
                                                onClick={handleOnSelectOption({ variantId: variant.id, optionId: option.id })}
                                            >{ option.name }</div>
                                        )) }
                                    </div>
                                </div>
                            )) }
                        </div>
                        <button type="submit">hi</button>
                    </div>
                    <div className="flex-[33%]">
                        {/* <SelectField.Base
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
                        </SelectField.Base> */}
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
                        <BaseIconButton>
                            <TbBuildingBank />
                        </BaseIconButton>
                        <BaseIconButton>
                            <TbMessage />
                        </BaseIconButton>
                    </div>
                    <Button fullWidth>Add to cart</Button>
                </div>
                <Toaster richColors closeButton />
            </fetcher.Form>
        </FormProvider>
    );
};

export default Page;