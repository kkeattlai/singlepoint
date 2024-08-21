import React from "react";
import { useLoaderData } from "@remix-run/react";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { useAuthToken } from "~/services/auth.server";
import { queryString } from "~/services/queryString.server";
import { z } from "zod";

export const action = async ({ request }: ActionFunctionArgs) => {
    return {};
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await useAuthToken.parse(request);
    const parsedQueryString = await queryString.safeParse(request,
        z.object({
            redirectUrl: z.string()
        })
    );

    if (!user) return redirect(parsedQueryString.success ? parsedQueryString.data.redirectUrl : "/");

    return redirect(parsedQueryString.success ? parsedQueryString.data.redirectUrl : "/" , {
        headers: [
            await useAuthToken.delete(request)
        ]
    });
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const loaderData = useLoaderData<typeof loader>();

    return (
        <div></div>
    );
};

export default Page;