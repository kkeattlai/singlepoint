import React, { useId } from "react";
import { tv } from "tailwind-variants";
import { useField } from "@rvf/remix";

import { cn } from "./utils";

const baseCheckbox = tv({
    
});

type CheckboxProps = {
    name: string;
    label?: string;
} & React.ComponentProps<"input">;

const Checkbox: React.FC<CheckboxProps> = ({ name, label }) => {
    const id = useId();
    const field = useField(name);

    return (
        <div className="flex items-center gap-1.5 select-none cursor-pointer">
            <input id={id} { ...field.getInputProps({ type: "checkbox", className: "cursor-pointer" }) } />
            <label htmlFor={id}
                className={
                    cn(
                        "text-sm text-gray-500 font-medium tracking-tight cursor-pointer transition",
                        { "text-gray-900": field.value() }
                    )
                }
            >{ label }</label>
        </div>
    );
};

export default Checkbox;