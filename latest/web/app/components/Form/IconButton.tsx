import React from "react";
import { useController, useFormContext } from "react-hook-form";

import BaseIconButton, { type IconButtonProps as BaseIconButtonProps } from "../IconButton";

type IconButtonProps = {
    name: string;
    value: string;
} & BaseIconButtonProps;

const IconButton: React.FC<IconButtonProps> = ({ ...props }) => {
    return (
        <BaseIconButton type="submit" { ...props } />
    );
};

export default IconButton;