import React from "react";
import { SerializeFrom } from "@remix-run/node";

import { cn } from "~/components/utils";

import { loader } from "../route";
import { useSearchParams } from "@remix-run/react";
import Button from "~/components/Button";

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
        <div
            className={
                cn(
                    "h-10 px-3 flex items-center gap-1 rounded-lg cursor-pointer z-10 hover:bg-gray-50 active:bg-gray-100 transition",
                    { "bg-gray-200 hover:bg-gray-200 active:bg-gray-200": isSelected }
                )
            }
        >
            <div className="h-10 flex flex-1 items-center gap-3" onClick={handleOnListClick}>
                <span
                    className={
                        cn(
                            "text-sm text-gray-400 active:text-gray-700 active:opacity-50",
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
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ isSelected, setIsSelected ] = React.useState<boolean>(false);

    const handleOnClearCategoryId = () => {
        setSearchParams(param => {
            param.delete("brandId");

            return param;
        });
    };

    React.useEffect(() => {
        setIsSelected(!!searchParams.get("brandId"))
    }, [ searchParams ]);

    return (
        brands.length > 0 && (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="py-1 text-sm font-bold tracking-tighter uppercase">Brands</div>
                    { isSelected && (
                        <Button type="button" variant="link" onClick={handleOnClearCategoryId}>Clear</Button>
                    ) }
                </div>
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