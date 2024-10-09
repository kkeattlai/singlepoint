import React from "react";
import { useController } from "react-hook-form";

import BaseTextField, { type TextFieldProps as BaseTextFieldProps } from "../TextField";

type TextFieldProps = {
    name: string;
} & BaseTextFieldProps;

const TextField: React.FC<TextFieldProps> = ({ name, ...props }) => {
    const { field } = useController({ name });

    return (
        <BaseTextField { ...props } { ...field }  />
    );
};

export default TextField;