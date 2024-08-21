import React from "react";
import { tv, VariantProps } from "tailwind-variants";

const baseButton = tv({
    base: "flex-none text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg transition hover:opacity-75 active:opacity-50",
    variants: {
        variant: {
            contained: "text-white",
            outlined: "bg-white",
            ghost: "hover:bg-gray-100 active:bg-gray-200",
            link: "bg-white"
        },
        color: {
            primary: "",
            warning: "",
            error: ""
        },
        size: {
            icon: "size-12 lg:size-10 flex items-center justify-center",
            normal: "w-fit h-12 md:h-10 min-w-[110px] h-12 px-5"
        },
        fullWidth: {
            true: "flex-none w-full"
        },
        isDisabled: {
            true: "opacity-25 pointer-events-none"
        }
    },
    compoundVariants: [
        {
            variant: "contained",
            color: "primary",
            className: "bg-indigo-600 focus-visible:ring-indigo-600"
        }, {
            variant: "outlined",
            color: "primary",
            className: "border-2 border-indigo-600 text-indigo-600 focus-visible:ring-indigo-600"
        }, {
            variant: "ghost",
            color: "primary",
            className: "focus-visible:ring-indigo-600"
        }, {
            variant: "link",
            color: "primary",
            className: "text-indigo-600 focus-visible:ring-indigo-600"
        }, {
            variant: "contained",
            color: "warning",
            className: "bg-amber-600 focus-visible:ring-amber-600"
        }, {
            variant: "outlined",
            color: "warning",
            className: "border-2 border-amber-600 text-amber-600 focus-visible:ring-amber-600"
        }, {
            variant: "ghost",
            color: "warning",
            className: "focus-visible:ring-amber-600"
        }, {
            variant: "link",
            color: "warning",
            className: "text-amber-60 focus-visible:ring-amber-600"
        }, {
            variant: "contained",
            color: "error",
            className: "bg-red-600 focus-visible:ring-red-600"
        }, {
            variant: "outlined",
            color: "error",
            className: "border-2 border-red-600 text-red-600 focus-visible:ring-red-600"
        }, {
            variant: "ghost",
            color: "error",
            className: "focus-visible:ring-red-600"
        }, {
            variant: "link",
            color: "error",
            className: "text-red-600 focus-visible:ring-red-600"
        }, {
            variant: "link",
            size: [ "normal", "icon" ],
            class: "size-fit min-w-fit md:h-fit p-0 hover:underline hover:underline-offset-1"
        }
    ],
    defaultVariants: {
        color: "primary",
        size: "normal",
        fullWidth: false
    }
});

type ButtonProps = {
    className?: string;
} & React.ComponentProps<"button"> & VariantProps<typeof baseButton>;

const Button: React.FC<ButtonProps> = ({ className, variant, color, size, fullWidth, isDisabled, ...props }) => {
    return (
        <button className={baseButton({ className, variant, color, size, fullWidth, isDisabled })} { ...props } >
            { props.children }
        </button>
    );
};

export default Button;