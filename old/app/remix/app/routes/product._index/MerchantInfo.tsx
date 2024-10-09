import React from "react";
import { NavLink, useLoaderData } from "@remix-run/react";

import Button from "~/components/Button";

import { loader } from "./route";

type MerchantInfoProps = {
    
};

const MerchantInfo: React.FC<MerchantInfoProps> = () => {
    const loaderData = useLoaderData<typeof loader>();
    
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <div className="font-semibold tracking-tight">{ loaderData.data.product.store.fullname }</div>
                <NavLink to={`/products?storeId=${loaderData.data.product.storeId}`}>
                    <Button variant="link">View</Button>
                </NavLink>
            </div>
            <div className="flex justify-evenly">
                <div className="py-3 first:rounded-l-lg last:rounded-r-lg flex flex-1 flex-col items-center justify-center bg-gray-100 ring-1 ring-gray-200">
                    <div className="text-lg font-bold tracking-tight">4.6</div>
                    <div className="text-xs text-gray-400">Rating</div>
                </div>
                <div className="py-3 first:rounded-l-lg last:rounded-r-lg flex flex-1 flex-col items-center justify-center bg-gray-100 ring-1 ring-gray-200">
                    <div className="text-lg font-bold tracking-tight">Verified</div>
                    <div className="text-xs text-gray-400">Seller</div>
                </div>
                <div className="py-3 first:rounded-l-lg last:rounded-r-lg flex flex-1 flex-col items-center justify-center bg-gray-100 ring-1 ring-gray-200">
                    <div className="text-lg font-bold tracking-tight">6800</div>
                    <div className="text-xs text-gray-400">sold</div>
                </div>
            </div>
        </div>
    );
};

export default MerchantInfo;