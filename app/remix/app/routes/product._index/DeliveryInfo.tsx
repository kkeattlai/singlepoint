
import React from "react";
import { z } from "zod";
import { FormProvider, useForm } from "@rvf/remix";
import { Form, useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";

import SelectField from "~/components/SelectField";
import { action, loader, validator, validationSchema } from "./route";
import { Key } from "react-aria-components";
import { DateTime } from "luxon";

type DeliveryKey = "destinationId" | "deliveryMethodId";

type DeliveryInfoProps = {
    
};

const DeliveryInfo: React.FC<DeliveryInfoProps> = () => {
    const [ searchParams, setSearchParams ] = useSearchParams();
    const loaderData = useLoaderData<typeof loader>();

    const handleOnSelectionChange = (key: DeliveryKey) => (value: Key) => {
        setSearchParams(param => {
            param.set(key, value as string);
            key === "destinationId" && param.delete("deliveryMethodId");

            return param;
        }, { replace: true, preventScrollReset: true });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <SelectField
                    variant="contained"
                    label="Destination"
                    data={loaderData.data.delivery.destinations.map(destination => ({ label: destination.name, value: destination.id }))} 
                    selectedKey={loaderData.data.defaultValues.destinationId}
                    onSelectionChange={handleOnSelectionChange("destinationId")}
                    fullWidth
                />
                <SelectField
                    variant="contained"
                    label="Delivery method"
                    data={loaderData.data.delivery.methods.map(method => ({ label: `${method.option.name} - ${method.charges <= 0 ? `Free` : `B$${method.charges.toFixed(2)}`}`, value: method.option.id }))}
                    selectedKey={loaderData.data.defaultValues.deliveryMethodId}
                    onSelectionChange={handleOnSelectionChange("deliveryMethodId")}
                    fullWidth
                />
            </div>
            { loaderData.data.delivery.info && (
                <div className="p-3 flex items-center justify-between gap-1.5 bg-gray-100 rounded-lg">
                    <div>
                        <div className="text-sm text-gray-800 font-semibold tracking-tight">
                            { DateTime.now().plus({ days: loaderData.data.delivery.info.minTime }).toFormat("dd LLL") } - { DateTime.now().plus({ days: loaderData.data.delivery.info.maxTime }).toFormat("dd LLL") }
                        </div>
                        <div className="text-xs text-gray-400">
                            <span>{ loaderData.data.delivery.info.option.name }</span>
                            <span> to </span>
                            <span>{ loaderData.data.delivery.info.destination.name }</span>
                        </div>
                    </div>
                    <div className="flex-none">
                        { loaderData.data.delivery.info.charges <= 0 ? (
                            <React.Fragment>
                                <span className="text-lg text-gray-800 font-semibold tracking-tight">Free</span>
                            </React.Fragment> 
                        ) : (
                            <React.Fragment>
                                <span className="text-[10px] text-gray-400">B$ </span>
                                <span className="text-lg text-gray-800 font-semibold tracking-tight">{ loaderData.data.delivery.info.charges.toFixed(2) }</span>
                            </React.Fragment>    
                        ) }
                    </div>
                </div>
            ) }
        </div>
    );
};

export default DeliveryInfo;