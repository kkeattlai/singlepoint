import React from "react";
import { TbChevronDown, TbMinus } from "react-icons/tb";
import { ComboBox as AriaComboBox, ComboBoxProps as AriaComboBoxProps, Button, Input, InputProps as AriaInputProps, Label, Popover, ListBox, ListBoxItem, Key, ListBoxItemProps } from "react-aria-components";

import { cn } from "./utils";

type ComboBoxWrapperProps<T extends object> = {
    label?: string;
    children: React.ReactNode | ((item: T) => React.ReactNode);
    placeholder?: string;
} & Omit<AriaComboBoxProps<T>, "children">;

const ComboBoxWrapper = <T extends object>({ label, placeholder, ...props }: ComboBoxWrapperProps<T>) => {
    const [ isOpen, setIsOpen ] = React.useState<boolean>(false);  

    return (
        <AriaComboBox
            aria-label={label ?? "Textfield input"}
            onOpenChange={setIsOpen}
            { ...props }
        >
            { label && (
                <Label className="text-xs text-gray-600 font-medium tracking-tight">{ label }</Label>
            ) }
            <div className="w-fit h-12 md:h-10 flex ring-1 ring-gray-200 rounded-lg transition focus-within:ring-2 focus-within:ring-indigo-600">
                <Input
                    className={({ isFocusVisible }) =>
                        cn(
                            "h-10 md:h-8 m-1 px-2 text-sm outline-none rounded-md transition",
                            { "ring-2 ring-indigo-600": isFocusVisible }
                        )
                    }
                    placeholder={placeholder}
                />
                <Button
                    className={
                        ({ isHovered, isPressed, isFocusVisible }) =>
                            cn(
                                "size-10 md:size-8 m-1 flex items-center justify-center outline-none rounded-md transition",
                                { "bg-gray-200": isOpen },
                                { "bg-gray-100": isHovered },
                                { "bg-gray-200": isPressed },
                                { "ring-2 ring-indigo-600": isFocusVisible },
                            )
                    }
                >
                    { isOpen ? (
                        <TbMinus />
                    ) : (
                        <TbChevronDown />
                    ) }
                </Button>
            </div>
            <Popover className="w-[--trigger-width] bg-white rounded-lg shadow-md ring-1 ring-gray-200" containerPadding={0}>
                <ListBox className="p-1 space-y-1">
                    { props.children }
                </ListBox>
            </Popover>
        </AriaComboBox>
    );
};

const ComboBoxItem: React.FC<ListBoxItemProps> = (props) => {
    return (
        <ListBoxItem
            { ...props }
            className={
                ({ isHovered, isSelected, isPressed, isDisabled, isFocusVisible }) =>
                    cn(
                        "h-12 md:h-10 text-sm px-2 flex items-center cursor-pointer transition rounded-md",
                        { "bg-gray-100": isHovered },
                        { "bg-gray-200": isPressed },
                        { "bg-gray-200": isSelected },
                        { "ring-2 ring-indigo-600": isFocusVisible },
                        { "pointer-events-none opacity-20": isDisabled }
                    )
            }
        />
    );
};

export default {
    Base: ComboBoxWrapper,
    Item: ComboBoxItem
};