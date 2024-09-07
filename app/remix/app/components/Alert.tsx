import React from "react";
import { tv } from "tailwind-variants";
import { cn } from "./utils";
import { color } from "framer-motion";
import { TbCircleCheck, TbExclamationCircle } from "react-icons/tb";

// const baseAlert = tv({
//     base: "h-12 lg:h-10",
// });

type AlertProps = {
    variant?: "contained" | "outlined";
    color?: "success" | "warning" | "error"
} & React.PropsWithChildren;

const Alert: React.FC<AlertProps> = ({ variant = "outlined", color = "success", ...props }) => {
    return (
        <div
            className={
                cn(
                    "min-h-12 lg:min-h-10 flex gap-1.5 text-sm px-3 py-[14px] lg:py-2.5 rounded-md",
                    { "bg-green-50 text-green-600 ring-1 ring-green-600 shadow shadow-green-100": variant === "outlined" && color === "success" },
                    { "bg-amber-50 text-amber-600 ring-1 ring-amber-600": variant === "outlined" && color === "warning" },
                    { "bg-red-50 text-red-600 ring-1 ring-red-600": variant === "outlined" && color === "error" }
                )
            }
        >
            <div>
                { color === "success" ? (
                    <TbCircleCheck size={19} strokeWidth={1.85} />
                ) : (
                    <TbExclamationCircle size={19} strokeWidth={1.85} />
                ) }
            </div>
            { props.children }
        </div>
    );
};

export default Alert;