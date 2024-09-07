import React from "react";
import { z } from "zod";
import { withZod } from "@rvf/zod";
import { TbLock, TbTrash } from "react-icons/tb";
import { validationError } from "@rvf/remix";
import { NavLink, useFetcher, useLoaderData } from "@remix-run/react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

import { prisma } from "~/services/db.server";
import { useCart } from "~/services/cart.server";
import Button from "~/components/Button";
import { getProductInventoryUrl } from "~/utils";

const validationSchema = z.object({
    _action: z.enum([ "removeFromCart" ]),
    id: z.string(),
    quantity: z.string()
});

const validator = withZod(validationSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
    const cart = await useCart.parse(request);
    const result = await validator.validate(await request.formData());

    if (result.error) return validationError(result.error, result.submittedData);

    const { _action, id, quantity } = result.data;

    if (_action === "removeFromCart") {
        return json({
            type: "success" as const,
            data: {
                message: "Item is removed successfully."
            }
        }, {
            headers: [
                await useCart.create([ ...cart.filter(cart => cart.inventoryId !== id) ])   
            ]
        });
    }

    return {};
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const cart = await useCart.parse(request);

    return {
        type: "success" as const,
        data: {
            shoppingCart: (await Promise.all(
                cart.map(async cart => ({
                    quantity: cart.quantity,
                    inventory: await prisma.inventory.findFirst({
                        where: { id: cart.inventoryId },
                        include: {
                            skus: {
                                include: {
                                    option: true,
                                },
                                orderBy: {
                                    sort: "asc"
                                }
                            },
                            product: {
                                include: {
                                    images: true,
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
                                    }
                                }
                            }
                        }
                    })
                }))
            )).map(cart => cart.inventory ? ({ ...cart, inventory: cart.inventory }) : null).filter(Boolean)
        }
    };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const fetcher = useFetcher<typeof action>();
    const loaderData = useLoaderData<typeof loader>();
    const salePrice = (loaderData.data.shoppingCart.reduce((acc, shoppingCart) => acc + (shoppingCart.inventory.salePrice + shoppingCart.inventory.product.salePrice), 0) / 100);
    const retailPrice = (loaderData.data.shoppingCart.reduce((acc, shoppingCart) => acc + (shoppingCart.inventory.retailPrice + shoppingCart.inventory.product.retailPrice), 0) / 100);
    const subtotal = retailPrice;
    const discountedPrice = retailPrice - salePrice;
    const total = salePrice;

    console.log({ subtotal, discountedPrice, total });

    return (
        <div className="container mx-auto flex px-4 gap-10">
            <div className="flex-1 space-y-3">
                <div>
                    <div className="text-lg font-semibold tracking-tight">Shopping bag</div>
                    <div className="text-xs text-gray-400">View / edit or remove items from your shopping bag before checking out to confirm your order.</div>
                </div>
                <div className="space-y-2">
                    { loaderData.data.shoppingCart.map(shoppingCart => (
                        <fetcher.Form key={shoppingCart.inventory.id} method="POST" className="flex items-center gap-3">
                            <div className="flex-none size-20 aspect-square bg-gray-400">
                                <img className="size-full object-cover" src={shoppingCart.inventory.product.images[0]?.url} />
                            </div>
                            <div className="space-y-1">
                                <div>
                                    <input name="id" value={shoppingCart.inventory.id} className="hidden" readOnly />
                                    <input name="quantity" value={1} className="hidden" readOnly />
                                    <NavLink to={getProductInventoryUrl(shoppingCart.inventory)}>
                                        <div className="text-sm font-semibold tracking-tight">{ shoppingCart.inventory.product.name }</div>
                                    </NavLink>
                                    <div className="text-xs text-gray-400">SKU: { shoppingCart.inventory.product.name }{ shoppingCart.inventory.skus.length > 0 ? ` / ${shoppingCart.inventory.skus.map(sku => sku.option.name).join(" / ")}` : "" }</div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {/* { !shoppingCart.isFavourite ? (
                                        <Button name="_action" value="addToFavourite" variant="link" color="info" className="text-xs" leadingIcon={<TbHeart />}>Save for later</Button>
                                    ) : (
                                        <Button name="_action" value="removeFromFavourite" variant="link" color="info" className="text-xs" leadingIcon={<TbHeartFilled />}>Saved for later</Button>
                                    ) }
                                    <div className="text-xs">|</div> */}
                                    <Button name="_action" value="removeFromCart" variant="link" color="info" className="text-xs" leadingIcon={<TbTrash />}>Remove</Button>
                                </div>
                            </div>
                        </fetcher.Form>
                    )) }
                </div>
            </div>
            <div className="w-[30%] bg-gray-100 p-4 rounded-lg">
                <div>Payment</div>
                <div className="flex items-center justify-between">
                    <div className="text-sm">Subtotal</div>
                    <div>
                        <span className="text-xs text-gray-500">B$</span>
                        <span className="text-xs font-semibold tracking-tight">{ subtotal.toFixed(2) }</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-sm">Discount</div>
                    <div>
                        <span className="text-xs text-gray-500">B$</span>
                        <span className="text-xs font-semibold tracking-tight">{ discountedPrice.toFixed(2) }</span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-sm">Total</div>
                    <div>
                        <span className="text-xs text-gray-500">B$</span>
                        <span className="text-lg font-semibold tracking-tight">{ total.toFixed(2) }</span>
                    </div>
                </div>
                <Button variant="contained" leadingIcon={<TbLock />} fullWidth="block">Checkout securely</Button>
            </div>
        </div>
    );
};

export default Page;