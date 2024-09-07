import React from "react";
import { useLoaderData } from "@remix-run/react";
import { Button, Label, ListBox, ListBoxItem, Popover, Select, SelectProps, SelectValue } from "react-aria-components";

import { cn } from "./utils";
import { useField } from "@rvf/remix";
import { TbChevronDown, TbCheck, TbMinus } from "react-icons/tb";

type BaseSelectFieldProps = {
    variant?: "outlined" | "contained" | "link";
    label?: string;
    data?: {
        label: string;
        value: string;
    }[];
    defaultValue?: string;
    fullWidth?: boolean
} & SelectProps<any>;

const BaseSelectField = React.forwardRef<HTMLDivElement, BaseSelectFieldProps>(({ name, variant = "outlined", label, data = [], fullWidth = false, ...props }, ref) => {
    return (
        <div>
            <Select
                ref={ref}
                { ...props }
                aria-label={label ? label : "SelectField"}
            >
                { ({ isOpen, isFocusVisible }) => (
                    <div className="space-y-0.5">
                        { label && (
                            <Label className="text-xs font-medium tracking-tight">{ label }</Label>
                        ) }
                        <Button
                            className={
                                cn(
                                    `min-w-[200px] h-12 lg:h-10 flex items-center gap-3 cursor-pointer outline-none transition rounded-lg`,
                                    { "ring-1 ring-gray-200": variant === "outlined" },
                                    { "bg-gray-100": variant === "contained" },
                                    { "bg-gray-50": isOpen },
                                    { "ring-2 ring-indigo-600": isFocusVisible },
                                    { "w-full": fullWidth }
                                )
                            }
                        >
                            <SelectValue className="flex-1 text-sm text-left pl-3" />
                            <div
                                className={
                                    cn(
                                        "size-10 md:size-8 m-1 flex items-center justify-center rounded",
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
                        <Popover
                            className="w-[--trigger-width] bg-white entering:animate-in entering:slide-in-from-top-2 entering:fade-in exiting:animate-out exiting:slide-out-to-top-2 exiting:fade-out"
                            containerPadding={0}
                        >
                            <ListBox className="p-1 space-y-0.5 ring-1 ring-gray-200 rounded-lg shadow-lg">
                                { data.map(data => (
                                    <ListBoxItem
                                        key={data.value}
                                        className={
                                            ({ isPressed, isHovered, isSelected, isDisabled, isFocusVisible }) =>
                                                cn(
                                                    "w-full h-12 lg:h-10 text-sm text-gray-600 px-3 flex items-center cursor-pointer outline-none transition rounded",
                                                    { "text-gray-900 bg-gray-200": isPressed },
                                                    { "text-gray-900 bg-gray-100": isHovered },
                                                    { "text-gray-900": isSelected },
                                                    { "text-gray-200": isDisabled },
                                                    { "ring-2 ring-indigo-600": isFocusVisible }
                                                )
                                        }
                                        id={data.value}
                                        textValue={data.label}
                                    >
                                        { ({ isSelected }) => (
                                            <div className="flex flex-1 items-center justify-between">
                                                <div>{ data.label }</div>
                                                { isSelected && (
                                                    <div className="text-green-700">
                                                        <TbCheck strokeWidth={3} />
                                                    </div>
                                                ) }
                                            </div>
                                        ) }
                                    </ListBoxItem>
                                )) }
                            </ListBox>
                        </Popover>
                    </div>
                ) }
            </Select>
        </div>
    );
});

type FormSelectFieldProps = {
    name: string;
} & BaseSelectFieldProps;

const FormSelectField: React.FC<FormSelectFieldProps> = ({ name, ...props }) => {
    const field = useField(name);
    const { ref, defaultValue: defaultSelectedKey, onChange } = field.getInputProps();

    return (
        <BaseSelectField
            ref={ref}
            name={name}
            defaultSelectedKey={defaultSelectedKey}
            onSelectionChange={onChange}
            { ...props }
        />    
    );
};

type SelectFieldProps = {

} & BaseSelectFieldProps;

const SelectField: React.FC<SelectFieldProps> = ({ name, ...props }) => {
    if (name) return <FormSelectField name={name} { ...props } />;

    return (
        <BaseSelectField { ...props } />
    );
};

export default SelectField;