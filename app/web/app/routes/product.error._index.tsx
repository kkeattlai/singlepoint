import React from "react";
import { z } from "zod";
import { useLoaderData, useNavigate, NavLink } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@remix-run/node";

import { queryString } from "~/services/queryString.server";

import Button from "~/components/Button";
import { prisma } from "~/services/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const parsedQueryString = queryString.safeParse(request,
        z.object({
            type: z.enum([ "product-id-malformed", "product-deleted" ])
        })
    );


    console.log(await prisma.category.findMany());

    if (parsedQueryString.error) {
        return {
            type: "success" as const,
            data: {
                type: "system-error" as const,
                message: "System error",
                advisory: "Please try again. If the problem continues, feel free to contact Singlepoint's support."
            }
        };
    }

    const { type } = parsedQueryString.data;

    return {
        type: "success" as const,
        data: {
            type,
            ...(type === "product-id-malformed") ? { message: "Invalid product ID", advisory: "Please try again. If the problem continues, feel free to contact Singlepoint's support." } : {},
            ...(type === "product-deleted") ? { message: "Product not found", advisory: "The product is no longer available. Would you like to return to the home page?" } : {},
        }
    };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const loaderData = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    const handleOnReload = () => {
        navigate(-1);
    };

    return (
        <div className="space-y-4">
            <div>
                <div className="text-lg text-gray-800 font-semibold tracking-tight">{ loaderData.data.message }</div>
                { loaderData.data.advisory && (
                    <div className="text-xs text-gray-400">{ loaderData.data.advisory }</div>
                ) }
            </div>
            <div className="flex items-center gap-4">
                { loaderData.data.type !== "product-deleted" && (
                    <Button variant="ghost" onClick={handleOnReload}>Reload</Button>
                ) }
                <NavLink to="/products">
                    { ({ isPending, isTransitioning }) => (
                        <Button isLoading={isPending || isTransitioning}>Home</Button>
                    ) }
                </NavLink>
            </div>
        </div>
    );
};

export default Page;