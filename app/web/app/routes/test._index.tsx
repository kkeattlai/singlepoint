import React from "react";
import { useLoaderData } from "@remix-run/react"
import { type LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return { type: "success" as const };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    return (
        // <div>{ Math.random() }</div>
        <div>asd</div>
    );
};

export default Page;