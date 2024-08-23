import React from "react";
import { redirect } from "@remix-run/react";
import { type LoaderFunctionArgs } from "@remix-run/node";

import { useAuthToken } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await useAuthToken.parse(request);

    if (!user) return redirect("/auth/login");

    return redirect("/");
};