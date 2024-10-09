import React from "react";
import { type Navigation } from "@remix-run/react";
import { Button as AriaButton, ButtonProps as AriaButtonProps, PressEvent } from "react-aria-components";

import { cn } from "./utils";
import Loading from "./Loading";

export type IconButtonProps = {
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    isLoading?: boolean;
} & AriaButtonProps;

const IconButton: React.FC<IconButtonProps> = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ size, isLoading, ...props }, ref) => {
    return (
        <AriaButton
            ref={ref}
            className={({ isHovered, isPressed, isDisabled, isFocusVisible }) =>
                cn(
                    `size-12 md:size-10 flex items-center justify-center text-lg outline-none select-none rounded-lg transition
                    ${isHovered ? `bg-gray-100` : ``},
                    ${isPressed ? `bg-gray-200` : ``}
                    ${isDisabled ? `pointer-events-none opacity-20` : ``}
                    ${isFocusVisible ? `ring-2 ring-indigo-600 ring-offset-2` : ``}`,
                    { "text-sm": size === "sm" },
                    { "text-md": size === "md" },
                    { "text-lg": size === "lg" },
                    { "text-xl": size === "xl" },
                    { "text-2xl": size === "2xl" },
                    {
                        // [
                        //     `text-white rounded-lg`
                        // ]: variant === "contained"
                    }
                )
            }
            { ...props }
        >
            { isLoading ? (
                <Loading variant="ghost" />
            ) : (
                props.children
            ) }
        </AriaButton>
    );
});

export default IconButton;