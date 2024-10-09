import React from "react";
import { redirect, useLoaderData } from "@remix-run/react"
import { type LoaderFunctionArgs } from "@remix-run/node";

import { session } from "~/services/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await session.get(request);

    if (!user) return redirect("/auth/login");

    console.log(user);

    return {};
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    return (
        <div>Dashboard</div>
    );
};

export default Page;