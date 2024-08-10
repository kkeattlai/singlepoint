import React from "react";
import { useController } from "react-hook-form";
import { useRemixFormContext } from "remix-hook-form";
import { cn } from "./utils";

type CheckboxProps = {
    name: string;
    label?: string;
} & React.ComponentProps<"input">;

const Checkbox: React.FC<CheckboxProps> = ({ name, label, defaultChecked: defaultValue = false, ...props }) => {
    const methods = useRemixFormContext();
    const { field, fieldState } = useController({ name, control: methods.control, defaultValue });

    return (
        <div className="flex items-center gap-1.5">
            <input
                id={name}
                type="checkbox"
                checked={field.value}
                { ...field }
                { ...props }
            />
            { label && (
                <label
                    htmlFor={name}
                    className={
                        cn(
                            "text-sm text-gray-500 transition",
                            { "text-gray-900": field.value }
                        )
                    }
                >{ label }</label>
            ) }
        </div>
    );
};

export default Checkbox;