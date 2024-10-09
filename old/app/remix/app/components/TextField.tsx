import React from "react";
import { useField } from "@rvf/remix";
import { tv, VariantProps } from "tailwind-variants";
import { TbEye, TbEyeOff } from "react-icons/tb";

import { cn } from "./utils";
import Button from "./Button";

const baseTextField = tv({
    base: "w-full h-12 lg:h-10 flex text-sm focus-within:ring-2 focus-within:ring-indigo-600 rounded-lg transition overflow-hidden",
    variants: {
        variant: {
            contained: "bg-gray-100 ring-1 ring-gray-100",
            outlined: "ring-1 ring-gray-200"
        },
        rounded: {
            sm: "rounded-sm",
            md: "rounded-md",
            lg: "rounded-lg",
            full: "rounded-full"
        },
        leadingIcon: {
            true: "pl-0",
            false: "pl-3"
        },
        trailingIcon: {
            true: "pr-0",
            false: "pr-3"
        },
        secureTextEntry: {
            true: "pr-0",
            false: "pr-3"
        },
        fieldError: {
            true: "ring-2 ring-red-600 focus-within:ring-red-600",
            false: ""
        }
    },
    compoundVariants: [
        {
            rounded: "full",
            leadingIcon: false,
            className: "pl-4"
        }
    ],
    defaultVariants: {
        variant: "outlined",
        rounded: "lg",
        leadingIcon: false,
        trailingIcon: false,
        secureTextEntry: false
    }
});

const baseIconButton = tv({
    variants: {
        variant: {
            contained: "bg-gray-200 ring-1 ring-gray-200 focus:ring-indigo-600",
            outlined: "bg-white focus:ring-indigo-600"
        },
        rounded: {
            sm: "rounded-sm",
            md: "rounded-md",
            lg: "rounded-lg",
            full: "rounded-full"
        }
    },
    defaultVariants: {
        variant: "outlined",
        rounded: "md"
    }
});

type TextFieldProps = {
    name: string;
    label?: string;
    secureTextEntry?: boolean;
    fullWidth?: boolean;
    hideDescription?: boolean;
} & React.ComponentProps<"input"> & Omit<VariantProps<typeof baseTextField>, "leadingIcon" | "trailingIcon"> & {
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
};

const TextField: React.FC<TextFieldProps> = ({ type, name, label, variant, rounded, leadingIcon, trailingIcon, fullWidth, hideDescription = false, secureTextEntry = false, ...props }) => {
    const field = useField<string>(name);
    const value = field.value();
    const [ isTextVisible, setIsTextVisible ] = React.useState<boolean>(!secureTextEntry);

    const handleOnToggleTextVisibility = () => {
        setIsTextVisible(isTextVisible => !isTextVisible);
    };

    return (
        <div
            className={
                cn(
                    "group space-y-1",
                    { "w-full": fullWidth }
                )
            }
        >
            <div
                className={
                    cn(
                        "text-sm text-gray-600 font-medium tracking-tight group-focus-within:text-gray-900 transition",
                        { "text-gray-900": value.length > 0 && !!!field.error() },
                        // { "text-red-600 group-focus-within:text-red-600": !!field.error() }
                    )
                }
            >{ label }</div>
            <div className={baseTextField({ variant, rounded, fieldError: !!field.error(), leadingIcon: !!leadingIcon, trailingIcon: !!trailingIcon, secureTextEntry })}>
                { leadingIcon && React.isValidElement(leadingIcon) && (
                    <div
                        className={
                            cn(
                                "size-10 lg:size-8 m-1 flex flex-none items-center justify-center text-gray-400 group-focus-within:text-gray-900 transition",
                                { "text-gray-900": value.length > 0 && !!!field.error() },
                                { "text-red-600 group-focus-within:text-red-600": !!field.error() }
                            )
                        }
                    >
                        { React.cloneElement(leadingIcon as React.ReactElement<any>, { size: 14, strokeWidth: 2.5 }) }
                    </div>
                ) }
                <input { ...field.getInputProps({ ...props, className: "w-full bg-transparent outline-none", type: isTextVisible ? "text" : "password" }) } />
                { secureTextEntry && (
                    <Button className={baseIconButton({ className: "size-10 lg:size-8 m-1", variant, rounded })} type="button" variant="ghost" size="icon" onPress={handleOnToggleTextVisibility}>
                        { !isTextVisible ? (
                            <TbEye size={16} strokeWidth={2.5} />
                        ) : (
                            <TbEyeOff size={16} strokeWidth={2.5} />
                        ) }
                    </Button>
                ) }
            </div>
            <div className={
                cn(
                    "h-4",
                    { "hidden": hideDescription },
                    { "block": !!field.error() }
                )
            }>
                { field.error() && (
                    <div className="text-xs text-red-600 font-semibold tracking-tight">{ field.error() }</div>
                ) }
            </div>
        </div>
    );
};

export default TextField;