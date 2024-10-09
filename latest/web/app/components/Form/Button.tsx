import React from "react";
import { useField } from "@rvf/remix";
import { type ButtonProps as AriaButtonProps } from "react-aria-components";

import BaseButton from "../Button";

type ButtonProps = {
    variant?: "contained" | "outlined" | "ghost" | "link";
    color?: "primary" | "secondary" | "success" | "warning" | "error";
} & AriaButtonProps;

const Button: React.FC<ButtonProps> = ({ ...props }) => {
    return (
        <BaseButton type="submit" { ...props } />
    );
};

export default Button;