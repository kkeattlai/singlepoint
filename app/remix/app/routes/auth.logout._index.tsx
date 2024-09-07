import React from "react";
import { z } from "zod";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useAuthToken } from "~/services/auth.server";
import { queryString } from "~/services/queryString.server";

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