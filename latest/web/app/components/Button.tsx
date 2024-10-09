import React from "react";
import { Button as AriaButton, ButtonProps as AriaButtonProps } from "react-aria-components";

import { cn } from "./utils";

type ButtonProps = {
    variant?: "contained" | "outlined" | "ghost" | "link";
    color?: "primary" | "secondary" | "success" | "warning" | "error";
    fullWidth?: boolean;
} & AriaButtonProps;

const Button: React.FC<ButtonProps> = React.forwardRef<HTMLButtonElement, ButtonProps>(({ variant = "contained", color = "primary", fullWidth, ...props }, ref) => {
    return (
        <AriaButton
            ref={ref}
            className={({ isHovered, isPressed, isDisabled, isFocusVisible }) =>
                cn(
                    `min-w-[110px] h-12 md:h-10 text-[13px] font-medium tracking-tight outline-none select-none transition
                    ${isDisabled ? `pointer-events-none opacity-20` : ``}
                    ${isFocusVisible ? `ring-2 ring-indigo-600 ring-offset-2` : ``}`,
                    {
                        [
                            `text-white rounded-lg`
                        ]: variant === "contained"
                    }, {
                        [
                            `bg-indigo-600
                            ${isHovered ? `bg-indigo-500` : ``}
                            ${isPressed ? `bg-indigo-700` : ``}`
                        ]: variant === "contained" && color === "primary"
                    }, {
                        [
                            `bg-gray-600
                            ${isHovered ? `bg-gray-500` : ``}
                            ${isPressed ? `bg-gray-700` : ``}`
                        ]: variant === "contained" && color === "secondary"
                    }, {
                        [
                            `bg-green-600
                            ${isHovered ? `bg-green-500` : ``}
                            ${isPressed ? `bg-green-700` : ``}`
                        ]: variant === "contained" && color === "success"
                    }, {
                        [
                            `bg-amber-600
                            ${isHovered ? `bg-amber-500` : ``}
                            ${isPressed ? `bg-amber-700` : ``}`
                        ]: variant === "contained" && color === "warning"
                    }, {
                        [
                            `bg-red-600
                            ${isHovered ? `bg-red-500` : ``}
                            ${isPressed ? `bg-red-700` : ``}`
                        ]: variant === "contained" && color === "error",
                    
                    
                    }, {
                        [
                            `border-2 bg-transparent rounded-lg
                            ${isHovered ? `opacity-80` : ``}
                            ${isPressed ? `opacity-50` : ``}`
                        ]: variant === "outlined"
                    }, {
                        [
                            `text-indigo-600 border-indigo-600`
                        ]: variant === "outlined" && color === "primary"
                    }, {
                        [
                            `text-gray-600 border-gray-600`
                        ]: variant === "outlined" && color === "secondary"
                    }, {
                        [
                            `text-green-600 border-green-600`
                        ]: variant === "outlined" && color === "success"
                    }, {
                        [
                            `text-amber-600 border-amber-600`
                        ]: variant === "outlined" && color === "warning"
                    }, {
                        [
                            `text-red-600 border-red-600`
                        ]: variant === "outlined" && color === "error"


                    }, {
                        [
                            `bg-white rounded-lg
                            ${isHovered ? `bg-gray-100` : ``}
                            ${isPressed ? `bg-gray-200 shadow` : ``}`
                        ]: variant === "ghost"
                    }, {
                        [
                            `text-indigo-600
                            ${isHovered ? `text-indigo-700` : ``}
                            ${isPressed ? `text-indigo-800` : ``}`
                        ]: variant === "ghost" && color === "primary"
                    }, {
                        [
                            `text-gray-600
                            ${isHovered ? `text-gray-700` : ``}
                            ${isPressed ? `text-gray-800` : ``}`
                        ]: variant === "ghost" && color === "secondary"
                    }, {
                        [
                            `text-green-600
                            ${isHovered ? `text-green-700` : ``}
                            ${isPressed ? `text-green-800` : ``}`
                        ]: variant === "ghost" && color === "success"
                    }, {
                        [
                            `text-amber-600
                            ${isHovered ? `text-amber-700` : ``}
                            ${isPressed ? `text-amber-800` : ``}`
                        ]: variant === "ghost" && color === "warning"
                    }, {
                        [
                            `text-red-600
                            ${isHovered ? `text-red-700` : ``}
                            ${isPressed ? `text-red-800` : ``}`
                        ]: variant === "ghost" && color === "error"


                    }, {
                        [
                            `min-w-fit h-fit md:h-fit rounded
                            ${isHovered ? `underline underline-offset-2` : ``}
                            ${isPressed ? `underline underline-offset-2` : ``}`
                        ]: variant === "link"
                    }, {
                        [
                            `text-indigo-600
                            ${isHovered ? `text-indigo-400 decoration-indigo-400` : ``}
                            ${isPressed ? `text-indigo-800 decoration-indigo-800` : ``}`
                        ]: variant === "link" && color === "primary"
                    }, {
                        [
                            `text-gray-600
                            ${isHovered ? `text-gray-400 decoration-gray-400` : ``}
                            ${isPressed ? `text-gray-800 decoration-gray-800` : ``}`
                        ]: variant === "link" && color === "secondary"
                    }, {
                        [
                            `text-green-600
                            ${isHovered ? `text-green-400 decoration-green-400` : ``}
                            ${isPressed ? `text-green-800 decoration-green-800` : ``}`
                        ]: variant === "link" && color === "success"
                    }, {
                        [
                            `text-amber-600
                            ${isHovered ? `text-amber-400 decoration-amber-400` : ``}
                            ${isPressed ? `text-amber-800 decoration-amber-800` : ``}`
                        ]: variant === "link" && color === "warning"
                    }, {
                        [
                            `text-red-600
                            ${isHovered ? `text-red-400 decoration-red-400` : ``}
                            ${isPressed ? `text-red-800 decoration-red-800` : ``}`
                        ]: variant === "link" && color === "error"
                    },
                    { "w-full": fullWidth }
                )
            }
            { ...props }
        >
            { props.children }
        </AriaButton>
    );
});

export default Button;