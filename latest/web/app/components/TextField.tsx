import React from "react";
import { TextField as AriaTextField, TextFieldProps as AriaTextFieldProps, Button, Input, Label } from "react-aria-components";

import { cn } from "./utils";
import { TbEye, TbEyeOff } from "react-icons/tb";

export type TextFieldProps = {
    label?: string;
    hidden?: boolean;
    secureTextEntry?: boolean;
} & AriaTextFieldProps;

const TextField = React.forwardRef<HTMLDivElement, TextFieldProps>(({ label, hidden = false, secureTextEntry, ...props }, ref) => {
    const [ isTextVisible, setIsTextVisible ] = React.useState<boolean>(false);

    const handleOnSetTextVisibility = () => {
        setIsTextVisible(isTextVisible => !isTextVisible);
    };

    return (
        <AriaTextField
            ref={ref}
            className={
                cn(
                    "p-[1.5px] space-y-0.5",
                    { "hidden": hidden }
                )
            }
            aria-label={label ?? "Textfield input"}
            { ...props }
        >
            { label && (
                <Label className="text-xs text-gray-600 font-medium tracking-tight">{ label }</Label>
            ) }
            <div
                className={
                    `w-fit h-12 md:h-10 flex ring-1 ring-gray-200 rounded-lg transition focus-within:ring-2 focus-within:ring-indigo-600`
                }
            >
                <Input
                    type={secureTextEntry ? isTextVisible ? "text" : "password" : "text"}
                    className={({ isFocusVisible }) =>
                        cn(
                            "h-10 md:h-8 m-1 px-2 text-sm outline-none rounded-md transition",
                            { "ring-2 ring-indigo-600": isFocusVisible }
                        )
                    }
                />
                { secureTextEntry && (
                    <Button
                        className={
                            ({ isHovered, isPressed, isFocusVisible }) =>
                                cn(
                                    "size-10 md:size-8 m-1 flex items-center justify-center outline-none rounded-md transition",
                                    { "bg-gray-100": isHovered },
                                    { "bg-gray-200": isPressed },
                                    { "bg-gray-200": isTextVisible },
                                    { "ring-2 ring-indigo-600": isFocusVisible },
                                )
                        }
                        onPress={handleOnSetTextVisibility}
                    >
                        { !isTextVisible ? (
                            <TbEye />
                        ) : (
                            <TbEyeOff />
                        ) }
                    </Button>
                ) }
            </div>
        </AriaTextField>
    );
});

export default TextField;