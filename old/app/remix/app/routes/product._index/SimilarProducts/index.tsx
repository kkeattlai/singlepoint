import React from "react";
import { NavLink, useLoaderData } from "@remix-run/react";

import { loader } from "../route";
import { getProductUrl } from "~/utils";
import { cn } from "~/components/utils";
import Button from "~/components/Button";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import FlatList from "~/components/FlatList";

type SimilarProductsProps = {
    
};

const SimilarProducts: React.FC<SimilarProductsProps> = () => {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <div>
            <div className="px-4 flex items-center gap-10 justify-between">
                <div>
                    <div className="text-lg font-semibold tracking-tight">Products you might like to see</div>
                    <div className="text-xs text-gray-400">The items listed below have been carefully selected to closely match the product you're currently viewing, offering similar features, styles, or functionalities that you might also find appealing.</div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outlined" size="icon" color="transparent" className="lg:size-8 border rounded-md" isDisabled>
                        <TbChevronLeft />
                    </Button>
                    <Button variant="outlined" size="icon" color="transparent" className="lg:size-8 border rounded-md">
                        <TbChevronRight />
                    </Button>
                </div>
            </div>
            <div className="px-2 flex flex-nowrap">
                {/* <FlatList>
                    { [ ...loaderData.data.similarProducts, ...loaderData.data.similarProducts, ...loaderData.data.similarProducts, ...loaderData.data.similarProducts ].map(product => (
                        // <NavLink to={getProductUrl(product)} className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 p-2">
                        <NavLink to={getProductUrl(product)} className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 p-2">
                            { ({ isPending, isTransitioning }) => (
                                <div
                                    className={
                                        cn(
                                            "break-inside-avoid space-y-1.5",
                                            { "opacity-10": isPending || isTransitioning }
                                        )
                                    }
                                >
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
                            ) }
                        </NavLink>
                    )) }
                </FlatList> */}
            </div>
        </div>
    );
};

export default SimilarProducts;