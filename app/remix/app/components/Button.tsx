import React from "react";
import { IconBaseProps } from "react-icons";
import { motion, AnimatePresence } from "framer-motion";
import { Button as AriaButton, ButtonProps as AriaButtonProps } from "react-aria-components";

import { cn } from "./utils";

type ButtonProps = {
    variant?: "contained" | "outlined" | "ghost" | "link";
    color?: "primary" | "secondary" | "transparent" | "info" | "success" | "warning" | "error";
    size?: "base" | "icon";
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    isLoading?: boolean;
    fullWidth?: "none" | "flex" | "block";
} & React.PropsWithChildren & AriaButtonProps;

const Button: React.FC<ButtonProps> = ({ variant = "contained", color = "primary", size = "base", fullWidth = "none", isLoading, isDisabled, ...props }) => {
    return (
        <AriaButton
            type="submit"
            { ...props }
            className={
                ({ isHovered, isPressed, isFocusVisible }) =>
                    cn(
                        `flex-none min-w-[110px] h-12 lg:h-10 text-[12px] flex items-center justify-center bg-transparent transition rounded-lg outline-none ${isHovered ? `bg-gray-50` : ``} ${isPressed ? `bg-gray-100 shadow-md` : ``}`,
                        { "ring-2 ring-indigo-600 ring-offset-2": isFocusVisible },
                        { "size-12 lg:size-10 min-w-fit": size === "icon" },
                        { [ `w-fit h-fit min-w-fit lg:h-fit rounded-none ${isHovered ? `bg-transparent underline` : ``} ${isPressed ? `translate-y-0 bg-transparent shadow-none` : ``}` ]: variant === "link" },
                        { [ `bg-indigo-600 ${isHovered ? `bg-indigo-500` : ``} ${isPressed ? `bg-indigo-400` : ``}`]: color === "primary" && (variant === "contained") },
                        { [ `bg-gray-600 ${isHovered ? `bg-gray-500` : ``} ${isPressed ? `bg-gray-400` : ``}` ]: color === "secondary" && (variant === "contained") },
                        { [ `bg-sky-600 ${isHovered ? `bg-sky-500` : ``} ${isPressed ? `bg-sky-400` : ``}` ]: color === "info" && (variant === "contained") },
                        { [ `bg-green-600 ${isHovered ? `bg-green-500` : ``} ${isPressed ? `bg-green-400` : ``}` ]: color === "success" && (variant === "contained") },
                        { [ `bg-amber-600 ${isHovered ? `bg-amber-500` : ``} ${isPressed ? `bg-amber-400` : ``}` ]: color === "warning" && (variant === "contained") },
                        { [ `bg-red-600 ${isHovered ? `bg-red-500` : ``} ${isPressed ? `bg-red-400` : ``}` ]: color === "error" && (variant === "contained") },
                        { [ `bg-indigo-100 ${isHovered ? `bg-indigo-200` : ``} ${isPressed ? `bg-indigo-300` : ``}`]: color === "primary" && variant === "ghost" },
                        { [ `bg-gray-100 ${isHovered ? `bg-gray-200` : ``} ${isPressed ? `bg-gray-300` : ``}` ]: color === "secondary" && variant === "ghost" },
                        { [ `bg-sky-100 ${isHovered ? `bg-sky-200` : ``} ${isPressed ? `bg-sky-300` : ``}` ]: color === "info" && variant === "ghost" },
                        { [ `bg-green-100 ${isHovered ? `bg-green-200` : ``} ${isPressed ? `bg-green-300` : ``}` ]: color === "success" && variant === "ghost" },
                        { [ `bg-amber-100 ${isHovered ? `bg-amber-200` : ``} ${isPressed ? `bg-amber-300` : ``}` ]: color === "warning" && variant === "ghost" },
                        { [ `bg-red-100 ${isHovered ? `bg-red-200` : ``} ${isPressed ? `bg-red-300` : ``}` ]: color === "error" && variant === "ghost" },
                        { [ `border-2 border-indigo-600 ${isHovered ? `border-indigo-500` : ``} ${isPressed ? `border-indigo-400` : ``}`]: color === "primary" && (variant === "outlined") },
                        { [ `border-2 border-gray-600 ${isHovered ? `border-gray-500` : ``} ${isPressed ? `border-gray-400` : ``}` ]: color === "secondary" && (variant === "outlined") },
                        { [ `border-2 border-sky-600 ${isHovered ? `border-sky-500` : ``} ${isPressed ? `border-sky-400` : ``}` ]: color === "info" && (variant === "outlined") },
                        { [ `border-2 border-green-600 ${isHovered ? `border-green-500` : ``} ${isPressed ? `border-green-400` : ``}` ]: color === "success" && (variant === "outlined") },
                        { [ `border-2 border-amber-600 ${isHovered ? `border-amber-500` : ``} ${isPressed ? `border-amber-400` : ``}` ]: color === "warning" && (variant === "outlined") },
                        { [ `border-2 border-red-600 ${isHovered ? `border-red-500` : ``} ${isPressed ? `border-red-400` : ``}` ]: color === "error" && (variant === "outlined") },
                        { "flex-1": fullWidth === "flex" },
                        { "flex-none w-full": fullWidth === "block" },
                        { "opacity-25 pointer-event-none": isLoading },
                        { "opacity-25 pointer-event-none": isDisabled },
                        props.className
                    )
            }
        >
            { ({ isHovered, isPressed }) => (
                <div
                    className={
                        cn(
                            `text-white flex items-center`,
                            { [ `text-indigo-600 ${isHovered ? `text-indigo-700` : ``} ${isPressed ? `text-indigo-600` : ``}` ]: color === "primary" && (variant === "outlined" || variant === "ghost" || variant === "link") },
                            { [ `text-gray-800 ${isHovered ? `text-gray-700` : ``} ${isPressed ? `text-gray-600` : ``}` ]: color === "secondary" && (variant === "outlined" || variant === "ghost" || variant === "link") },
                            { [ `text-gray-600 ${isHovered ? `text-gray-700` : ``} ${isPressed ? `text-gray-600` : ``}` ]: color === "transparent" && (variant === "outlined" || variant === "ghost" || variant === "link") },
                            { [ `text-sky-600 ${isHovered ? `text-sky-700` : ``} ${isPressed ? `text-sky-600` : ``}` ]: color === "info" && (variant === "outlined" || variant === "ghost" || variant === "link") },
                            { [ `text-green-600 ${isHovered ? `text-green-700` : ``} ${isPressed ? `text-green-600` : ``}` ]: color === "success" && (variant === "outlined" || variant === "ghost" || variant === "link") },
                            { [ `text-amber-600 ${isHovered ? `text-amber-700` : ``} ${isPressed ? `text-amber-600` : ``}` ]: color === "warning" && (variant === "outlined" || variant === "ghost" || variant === "link") },
                            { [ `text-red-600 ${isHovered ? `text-red-700` : ``} ${isPressed ? `text-red-600` : ``}` ]: color === "error" && (variant === "outlined" || variant === "ghost" || variant === "link") },
                        )
                    }
                >
                    { size === "base" && (
                        <AnimatePresence mode="wait" initial={false}>
                            { isLoading ? (
                                <motion.div
                                    initial={{ width: 0, marginRight: 0, opacity: 0 }}
                                    animate={{ width: 16, marginRight: 8, opacity: 1 }}
                                    exit={{ width: 0, marginRight: 0, opacity: 0 }}
                                    style={{ transformOrigin: "left" }}
                                >
                                    <svg
                                        className={
                                            cn(
                                                "animate-spin w-4 h-4",
                                                { "text-indigo-600": color === "primary" },
                                                { "text-gray-600": color === "secondary" },
                                                { "text-gray-600": color === "transparent" },
                                                { "text-sky-600": color === "info" },
                                                { "text-green-600": color === "success" },
                                                { "text-amber-600": color === "warning" },
                                                { "text-red-600": color === "error" },
                                                { "text-white": variant === "contained" },
                                            )
                                        }
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </motion.div>
                            ) : props.leadingIcon ? (
                                <div
                                    className={
                                        cn(
                                            "mr-2",
                                            { "mr-0.5": variant === "link" }
                                        )
                                    }
                                >
                                    { React.cloneElement<IconBaseProps>(props.leadingIcon as any, { size: 13, strokeWidth: 2.5 }) }
                                </div>
                            ) : null }
                        </AnimatePresence>
                    ) }
                    <div>
                        { size === "icon" ? (
                            React.cloneElement<IconBaseProps>(props.children as any, { size: 18 })
                        ) : (
                            <div className="font-medium tracking-tight">{ props.children }</div>
                        ) }
                    </div>
                    { size === "base" && (
                        props.trailingIcon ? (
                            <div
                                className={
                                    cn(
                                        "ml-2",
                                        { "ml-0.5": variant === "link" }
                                    )
                                }
                            >
                                { React.cloneElement<IconBaseProps>(props.trailingIcon as any, { size: 18 }) }
                            </div>
                        ) : null
                    ) }
                </div>
            ) }
        </AriaButton>
    );
};

export default Button;