import React from "react";
import { useField } from "remix-validated-form";

type GroupFieldProps = {
    name: string;
    label?: string;
    description?: string;
} & React.ComponentProps<"div">;

const GroupField: React.FC<GroupFieldProps> = ({ name, label, description, ...props }) => {
    const fields = useField(name);

    return (
        <div className="space-y-0.5">
            { label && (
                <div className="text-sm text-gray-700">{ label }</div>
            ) }
            <div className="h-12 lg:h-10 flex rounded-lg">
                { React.Children.map(props.children, child => (
                    React.cloneElement(child as React.ReactElement, { className: "first:border-l border-r border-y border-gray-200 first:rounded-tl-lg first:rounded-bl-lg last:rounded-tr-lg last:rounded-br-lg focus-within:ring-2 focus-within:ring-indigo-600" })
                )) }
            </div>
            <div className="h-4 text-xs">
                { fields.error ? (
                    <span className="text-red-600">{ fields.error }</span>
                ) : (
                    <span className="text-gray-400">{ description }</span>
                ) }
            </div>
        </div>
    );
};

export default GroupField;