import React from "react";
import { TbEye, TbEyeOff } from "react-icons/tb";
import { useControlField, useField } from "remix-validated-form";
import { cn } from "~/utils";
import Button from "./Button";

type InputProps = {
    name: string;
    onChangeText?: (value: string) => void;
} & React.ComponentProps<"input">;

const Input: React.FC<InputProps> = ({ className, name, onChangeText, ...props }) => {
    const fields = useField(name);
    const [ value, setValue ] = useControlField<string>(name);

    return (
        <input
            {
                ...fields.getInputProps({
                    className: cn(
                        "w-full h-full text-sm bg-transparent outline-none",
                        className
                    ),
                    value: value ?? "",
                    onChange: (e) => {
                        setValue(e.target.value);
                        onChangeText && onChangeText(e.target.value);
                    },
                    ...props
                })
            }
        />
    );
};

type TextFieldProps = {
    name: string;
    variant?: "outlined" | "ghost" | "base";
    label?: string;
    description?: string;
    leadingIcons?: React.ReactElement;
    trailingIcons?: React.ReactElement;
    fullWidth?: boolean;
    hideDescription?: boolean;
    secureTextEntry?: boolean;
    onChangeText?: (value: string) => void;
} & React.ComponentProps<"input">;

const TextField: React.FC<TextFieldProps> = ({ className, name, variant = "outlined", label, description, leadingIcons, trailingIcons, fullWidth, hideDescription, secureTextEntry, onChangeText, ...props }) => {
    const fields = useField(name);
    const [ isTextVisible, setIsTextVisible] = React.useState<boolean>(!secureTextEntry);

    const handleOnToggleTextVisibility = () => {
        setIsTextVisible(isTextVisible => !isTextVisible);
    };
    
    if (variant === "base") {
        return (
            <Input
                type={isTextVisible ? "text" : "password"}
                className={
                    cn(
                        "px-2",
                        { "pl-0 pr-2": !!leadingIcons },
                        { "pl-2 pr-0": !!trailingIcons || secureTextEntry },
                        className
                    )   
                }
                onChangeText={onChangeText}
                { ...{ name, ...props } }
            />
        );
    }

    return (
        <div className="space-y-0.5">
            { label && (
                <div className="text-sm text-gray-700">{ label }</div>
            ) }
            <div
                className={
                    cn(
                        "h-12 lg:h-10 p-1 flex items-center gap-1 border border-gray-200 transition rounded-lg focus-within:ring-2 focus-within:ring-indigo-600",
                        { "border-gray-100 bg-gray-100": variant === "ghost" },
                        { "w-full flex-1": fullWidth }
                    )
                }
            >
                { leadingIcons && (
                    React.cloneElement(leadingIcons, { strokeWidth: 2.5 })
                ) }
                <Input
                    type={isTextVisible ? "text" : "password"}
                    className={
                        cn(
                            "px-2",
                            { "pl-0 pr-2": !!leadingIcons },
                            { "pl-2 pr-0": !!trailingIcons || secureTextEntry }
                        )   
                    }
                    onChangeText={onChangeText}
                    { ...{ name, ...props } }
                />
                { trailingIcons && (
                    React.cloneElement(trailingIcons, { strokeWidth: 2.5 })
                ) }
                { secureTextEntry && (
                    <Button type="button" variant="ghost" size="icon" className="size-8 lg:size-8 text-gray-700" onClick={handleOnToggleTextVisibility}>
                        { !isTextVisible ? React.cloneElement(<TbEye />, { strokeWidth: 1.5 }) : React.cloneElement(<TbEyeOff />, { strokeWidth: 1.5 }) }
                    </Button>
                ) }
            </div>
            { !hideDescription && (
                <div className="h-4 text-xs">
                    { fields.error ? (
                        <span className="text-red-600">{ fields.error }</span>
                    ) : (
                        <span className="text-gray-400">{ description }</span>
                    ) }
                </div>
            ) }
        </div>
    );
};

export default TextField;