import { SerializeFrom } from "@remix-run/node";

import { loader } from "../route";
import { NavLink } from "@remix-run/react";
import { cn } from "~/components/utils";
import { getProductUrl } from "~/utils";
import Button from "~/components/Button";
import { TbHeart, TbHeartFilled, TbStarFilled } from "react-icons/tb";

type ProductProps = {
    product: SerializeFrom<typeof loader>["data"]["masonry"]["2"][number];
};

const Product: React.FC<ProductProps> = ({ product }) => {
    const salePrice = product.salePrice / 100;
    const retailPrice = product.retailPrice / 100;
    const discountPrice = retailPrice - salePrice;

    return (
        <NavLink to={getProductUrl(product)}>
            { ({ isPending, isTransitioning }) => (
                <div
                    className={
                        cn(
                            "break-inside-avoid space-y-1.5",
                            { "opacity-10": isPending || isTransitioning }
                        )
                    }
                >
                    <div className="relative">
                        <img className="w-full rounded-lg" src={product.images[0].url} /> 
                        <div className="absolute top-0 right-0">
                            <Button variant="ghost" size="icon" color="transparent" className="size-9">
                                { !product.isFavourite ? (
                                    <TbHeart />
                                ) : (
                                    <TbHeartFilled />
                                ) }
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-0.5">
                        <div className="text-[11px] text-gray-400">{ product.brand?.name }</div>
                        <div className="text-xs font-bold text-gray-900 tracking-tight line-clamp-2">{ product.name }</div>
                        <div className="flex justify-between">
                            <div className="flex items-center gap-1.5">
                                <TbStarFilled className="text-xs text-amber-400" />
                                <div className="flex items-center text-xs text-gray-400 tracking-tight gap-1.5">
                                    <div>4.9 </div>
                                    <div className="w-[1px] h-[10.5px] bg-gray-400 rounded-lg" />
                                    <div> 2341</div>
                                </div>
                            </div>
                            { !discountPrice ? (
                                <span className="text-base text-gray-800 font-bold tracking-tighter">${ salePrice.toFixed(2) }</span>
                            ) : (
                                <div className="relative flex flex-col items-center gap-1">
                                    <span className="absolute top-0 right-0 -mt-3 text-xs text-gray-400 line-through">${ retailPrice.toFixed(2) }</span>
                                    <span className="text-base text-gray-800 font-bold tracking-tighter">${ salePrice.toFixed(2) }</span>
                                </div>
                            ) }
                        </div>
                    </div>
                </div>
            ) }
        </NavLink>
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

export default Masonry;