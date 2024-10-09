import React from "react";
import { type Key, type ComboBoxProps as AriaComboBoxProps } from "react-aria-components";
import { useField } from "@rvf/remix";

import BaseComboBox from "../ComboBox";

type ComboBoxWrapperProps<T extends object> = {
    name: string;
    label?: string;
    children: React.ReactNode | ((item: T) => React.ReactNode);
} & Omit<AriaComboBoxProps<T>, "children">;

const ComboBoxWrapper = <T extends object>({ name, ...props }: ComboBoxWrapperProps<T>) => {
    const field = useField(name);
    const { ref, onChange, defaultValue, ...rest } = field.getInputProps();

    console.log({ ...rest })

    const handleOnSelectionChange = (key: Key | null) => {
        onChange && onChange(key);
    };

    return (
        <BaseComboBox.Base
            { ...props }
            { ...rest }
            defaultSelectedKey={defaultValue}
            onSelectionChange={handleOnSelectionChange}
        >
            { props.children }
        </BaseComboBox.Base>
    );
};

export default {
    Base: ComboBoxWrapper,
    Item: BaseComboBox.Item
};