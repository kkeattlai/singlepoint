import React from "react";
import { useController } from "react-hook-form";
import { Button, Key, Label, ListBox, ListBoxItem, ListBoxItemProps, Popover, Select, SelectProps, SelectValue } from "react-aria-components";
import { TbChevronDown, TbMinus } from "react-icons/tb";
import { cn } from "../utils";

type SelectFieldProps<T extends object> = {
    name: string;
    label?: string;
    items?: Iterable<T>;
    children: React.ReactNode | ((item: T) => React.ReactNode);
    fullWidth?: boolean;
} & Omit<SelectProps<T>, "children">;

const Base = <T extends object>({ name, label, items, fullWidth, ...props }: SelectFieldProps<T>) => {
    // const field = useField<string>(name);
    // const { value, onChange, ...rest } = field.getControlProps();
    const { field: { value, onChange, ...rest } } = useController({ name });

    const handleOnSelectionChange = (key: Key) => {
        onChange && onChange(key as string);
    };

    console.log({ value });

    return (
        <Select
            className="p-[1.5px]"
            aria-label={label ?? "Selectfield input"}
            selectedKey={value}
            onSelectionChange={handleOnSelectionChange}
            // { ...rest }
            { ...rest }
            { ...props }
        >
            { ({ isOpen, isFocused, isFocusVisible }) => (
                <React.Fragment>
                    { label && (
                        <Label />
                    ) }
                    <Button
                        className={
                            cn(
                                "min-w-[163px] h-12 md:h-10 ring-1 ring-gray-200 flex items-center gap-1 rounded-lg outline-none transition",
                                { "ring-2 ring-indigo-600": isOpen },
                                { "w-full": fullWidth },
                                props.className
                            )
                        }
                    >
                        <SelectValue className="text-sm text-left flex-1 pl-3" />
                        <div
                            className={
                                cn(
                                    "size-10 md:size-8 m-1 flex items-center justify-center rounded-md transition",
                                    { "bg-gray-200": isOpen }
                                )
                            }
                        >
                            { isOpen ? (
                                <TbMinus />
                            ) : (
                                <TbChevronDown />
                            ) }
                        </div>
                    </Button>
                    <Popover className="w-[--trigger-width] outline-none">
                        <ListBox className="p-1 space-y-1 bg-white ring-1 ring-gray-200 outline-none shadow-md rounded-lg" items={items}>
                            { props.children }
                        </ListBox>
                    </Popover>
                </React.Fragment>
            ) }
        </Select>
    );
};

type ItemProps = {

} & ListBoxItemProps;

const Item = ({ ...props }: ItemProps) => {
    return (
        <ListBoxItem
            className={
                ({ isHovered, isPressed, isSelected, isFocusVisible }) =>
                    cn(
                        "text-sm h-12 p-2 px-3 md:h-10 flex items-center outline-none cursor-pointer rounded-md transition",
                        { "bg-gray-100": isHovered },
                        { "bg-gray-200": isPressed },
                        { "bg-gray-200": isSelected },
                        { "ring-2 ring-indigo-600": isFocusVisible }
                    )
            }
            { ...props }
        >
            { props.children }
        </ListBoxItem>
    );
};

export default {
    Base,
    Item
};