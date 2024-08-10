import React from "react";
import { useSearchParams } from "@remix-run/react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

import { cn } from "~/components/utils";
import Button from "~/components/Button";

type QuantityFieldProps = {
    quantity: number;
    stock?: number;
};

const QuantityField: React.FC<QuantityFieldProps> = ({ quantity, stock = 0 }) => {
    const [ searchParams, setSearchParams ] = useSearchParams();

    const handleOnSubtract = () => {
        setSearchParams(param => {
            quantity > 1 && param.set("quantity", `${quantity - 1}`);

            return param;
        }, { replace: true, preventScrollReset: true });
    };

    const handleOnAddition = () => {
        setSearchParams(param => {
            stock > quantity && param.set("quantity", `${quantity + 1}`);

            return param;
        }, { replace: true, preventScrollReset: true });
    };

    return (
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" size="icon" onClick={handleOnSubtract} isDisabled={quantity <= 1}>
                    <AiOutlineMinus />
                </Button>
                <div
                    className={
                        cn(
                            "text-sm select-none",
                            { "opacity-25": stock === 0 }
                        )
                    }
                >{ quantity }</div>
                <Button type="button" variant="ghost" size="icon" onClick={handleOnAddition} isDisabled={stock <= quantity}>
                    <AiOutlinePlus />
                </Button>
            </div>
            { stock === 0 ? (
                <div className="px-2.5 py-1 bg-red-100 text-xs text-red-600 font-semibold tracking-tight select-none rounded">Out of stock</div>
            ) : stock <= 5 ? (
                <div className="px-2.5 py-1 bg-amber-100 text-xs text-amber-600 font-semibold tracking-tight select-none rounded">Limited stock available</div>
            ) : (
                <div className="px-2.5 py-1 bg-green-100 text-xs text-green-600 font-semibold tracking-tight select-none rounded">In stock</div>
            ) }
        </div>
    );
};

export default QuantityField;