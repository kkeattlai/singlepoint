import React from "react";
import { SerializeFrom } from "@remix-run/node";

import { cn } from "~/components/utils";

import { loader } from "../route";
import { useSearchParams } from "@remix-run/react";

type ListProps = {
    brand: SerializeFrom<typeof loader>["data"]["brands"][number];
};

const List: React.FC<ListProps> = ({ brand }) => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const isSelected = !!(searchParams.get("brandId") === brand.id);

    const handleOnListClick  = () => {
        setSearchParams(param => {
            brand.id ? param.set("brandId", brand.id) : param.delete("brandId");

            return param;
        }, { replace: true, preventScrollReset: true });
    };

    return (
        <div className="relative h-10 px-3 flex items-center gap-1 text-sm text-gray-600 font-medium tracking-tight rounded-lg cursor-pointer">
            <div className="h-10 flex flex-1 items-center gap-3" onClick={handleOnListClick}>
                <span
                    className={
                        cn(
                            "text-gray-500 active:text-gray-700 active:opacity-50",
                            { "text-gray-900": isSelected }
                        )
                    }
                >{ brand.name }</span>
                { brand._count.products !== undefined && brand._count.products > 0 && (
                    <div className="px-2 py-0.5 text-[10px] bg-sky-100 text-sky-600 rounded">{ brand._count.products }</div>
                ) }
            </div>
        </div>
    );
};

type BrandsProps = {
    brands: SerializeFrom<typeof loader>["data"]["brands"];
};

const Brands: React.FC<BrandsProps> = ({ brands }) => {
    return (
        brands.length > 0 && (
            <div className="space-y-3">
                <div className="py-1 text-sm font-bold tracking-tighter uppercase">Brands</div>
                <div>
                    { brands.map(brand => (
                        <List key={brand.id} brand={brand} />
                    )) }
                </div>
            </div>
        )
    );
};

export default Brands;