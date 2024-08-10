import React from "react";
import { useLoaderData, redirect } from "@remix-run/react";
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

import { prisma } from "~/services/db.server";
import { useAuthToken } from "~/services/auth.server";
import { DateTime } from "luxon";

export const action = async ({ request }: ActionFunctionArgs) => {
    return {};
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await useAuthToken.parse(request);

    if (!user) return redirect("/auth/login");

    const { id, email, status } = user;

    return {
        type: "success" as const,
        data: {
            id, email, status
        }
    };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <div>
            <div>{ loaderData.data.email }</div>
            <div>{ DateTime.fromISO(loaderData.data.status.createdAt).toRelative() }</div>
        </div>
    );
};

export default Page;