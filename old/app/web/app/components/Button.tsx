import React from "react";
import { useRemixFormContext } from "remix-hook-form";

import { cn } from "./utils";
import Loading from "./Loading";

type BaseButtonProps = {
    variant?: "contained" | "ghost" | "link";
    color?: "primary" | "secondary" | "warning" | "danger";
    isLoading?: boolean;
    isDisabled?: boolean;
    fullWidth?: boolean;
} & React.ComponentProps<"button"> & ({
    size?: "icon";
    children?: React.ReactElement;
} | {
    size?: "main";
    children?: React.ComponentProps<"button">["children"];
});

const BaseButton: React.FC<BaseButtonProps> = React.forwardRef(({ name, className, variant = "contained", size = "main", color, isLoading, isDisabled, fullWidth, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={
                cn(
                    "text-sm font-medium tracking-tight flex items-center justify-center transition rounded-lg",
                    { "bg-indigo-600 text-white xl:hover:opacity-50 active:opacity-25": variant === "contained" },
                    { "text-indigo-600 xl:hover:opacity-50 active:bg-gray-200": variant === "ghost" },
                    { "text-indigo-600 xl:hover:opacity-50 active:bg-gray-200": variant === "link" },
                    { "bg-indigo-600 text-white": variant === "contained" && color === "primary" },
                    { "bg-gray-600 text-white": variant === "contained" && color === "secondary" },
                    { "bg-amber-600 text-white": variant === "contained" && color === "warning" },
                    { "bg-red-600 text-white": variant === "contained" && color === "danger" },
                    { "text-indigo-600": variant === "ghost" && color === "primary" },
                    { "text-gray-600": variant === "ghost" && color === "secondary" },
                    { "text-amber-600": variant === "ghost" && color === "warning" },
                    { "text-red-600": variant === "ghost" && color === "danger" },
                    { "text-indigo-600": variant === "link" && color === "primary" },
                    { "text-gray-600": variant === "link" && color === "secondary" },
                    { "text-amber-600": variant === "link" && color === "warning" },
                    { "text-red-600": variant === "link" && color === "danger" },
                    { "hover:underline": variant === "link" && size === "main" },
                    { "min-w-[110px] h-[50px] px-3 xl:h-10": variant === "contained" && size === "main" },
                    { "flex-none size-[50px] xl:size-10 xl:text-lg": size === "icon" },
                    { "text-gray-800": size === "icon" && variant === "ghost" },
                    { "opacity-25 pointer-events-none": isLoading },
                    { "opacity-25 pointer-events-none": isDisabled },
                    { "w-full": fullWidth },
                    className
                )
            }
            { ...props }
        >
            { size === "icon" ? (
                isLoading ? (
                    <Loading variant={variant} color={color} />
                ) : (
                    React.cloneElement(props.children as React.ReactElement<any>, { fontSize: 16, strokeWidth: 2.5 })
                )
            ) : (
                <div className="flex items-center gap-2">
                    { isLoading && (
                        <Loading variant={variant} color={color} />
                    ) }
                    <div>
                        { props.children }
                    </div>
                </div>
            ) }
        </button>
    );
});

type FormButtonProps = {
    name: string;
    variant?: "contained" | "ghost" | "link";
    size?: "main" | "icon";
    color?: "primary" | "secondary" | "warning" | "danger";
    isLoading?: boolean;
    isDisabled?: boolean;
    fullWidth?: boolean;
} & React.ComponentProps<"button"> & ({
    size?: "icon";
    children?: React.ReactElement;
} | {
    size?: "main";
    children?: React.ComponentProps<"button">["children"];
});

const FormButton: React.FC<FormButtonProps> = React.forwardRef(({ name, value, onClick, ...props }, ref) => {
    const methods = useRemixFormContext();

    const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        methods.setValue(name, value ?? "");
        onClick && onClick(e);
    };

    return (
        <BaseButton { ...props } ref={ref} onClick={handleOnClick} />
    );
});

type ButtonProps = {
    variant?: "contained" | "ghost" | "link";
    size?: "main" | "icon";
    color?: "primary" | "secondary" | "warning" | "danger";
    isLoading?: boolean;
    isDisabled?: boolean;
    fullWidth?: boolean;
} & React.ComponentProps<"button"> & ({
    size?: "icon";
    children?: React.ReactElement;
} | {
    size?: "main";
    children?: React.ComponentProps<"button">["children"];
});

const Button: React.FC<ButtonProps> = React.forwardRef(({ name, ...props }, ref) => {
    if (name) {
        return <FormButton ref={ref} name={name} { ...props } />
    }

    return (
        <BaseButton ref={ref} { ...props } />
    );
});

export default Button;