import React from "react";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Form, NavLink, redirect, useFetcher, useLoaderData } from "@remix-run/react";
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { zodResolver } from "@hookform/resolvers/zod";
import { SiPronounsdotpage } from "react-icons/si";
import { getValidatedFormData, RemixFormProvider, useRemixForm } from "remix-hook-form";

import Image from "~/components/Image";
import Button from "~/components/Button";
import Checkbox from "~/components/Checkbox";
import TextField from "~/components/TextField";
import { prisma } from "~/services/db.server";
import { session } from "~/services/session.server";
import { responseError, validationError } from "~/services/response.server";
import { isError } from "~/utils";

import happy_male_character from "../../../public/happy_male_character.png";

const validationSchema = z.object({
    email: z.string().email("The provided email is invalid. Eg: user@gmail.com"),
    // password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "The provided password is invalid. It must be at least 8 characters long and include at least one letter, one number, and one special character."),
    password: z.string(),
    rememberMe: z.coerce.boolean()
});

export const action = async ({ request }: ActionFunctionArgs) => {
    const result = await getValidatedFormData(request, zodResolver(validationSchema));

    if (result.errors) return validationError(result.errors, result.receivedValues);

    const { email, password } = result.data;
    
    const user = await prisma.user.findFirst({
        where: { email }
    });

    if (!user) {
        return responseError(
            [
                { code: "Unauthorised" }
            ],
            result.receivedValues
        );
    }

    if (!await bcrypt.compare(password, user.password)) {
        return responseError(
            [
                { code: "Unauthorised" }
            ],
            result.receivedValues
        );
    }

    return redirect("/auth/success", {
        headers: [
            await session.create({ id: "asd" })
        ]
    });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await session.get(request);

    if (user) return redirect("/auth/success");

    return {
        type: "success" as const,
        data: {
            message: "Ok"
        }
    };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const fetcher = useFetcher<typeof action>();
    const loaderData = useLoaderData<typeof loader>();
    const [ credentials, setCredentials ] = React.useState<z.infer<typeof validationSchema>>({ email: "", password: "", rememberMe: false });
    const methods = useRemixForm<z.infer<typeof validationSchema>>({
        fetcher,
        values: credentials,
        resolver: zodResolver(validationSchema)
    });

    React.useEffect(() => {
        const parsedCredentials = z.object({
            email: z.string(),
            password: z.string(),
            rememberMe: z.coerce.boolean()
        }).safeParse(JSON.parse(window.localStorage.getItem("__credentials") || "{}"));

        parsedCredentials.success && setCredentials(parsedCredentials.data);
    }, []);

    React.useEffect(() => {
        methods.watch(({ email, password, rememberMe }) => {
            rememberMe ? window.localStorage.setItem("__credentials", JSON.stringify({ email, password, rememberMe })) : window.localStorage.removeItem("__credentials");
        });
    }, [ methods.watch ]);

    return (
        <div className="container mx-auto space-y-4 xl:space-y-0 py-1 flex items-center gap-20">
            <div className="hidden xl:block flex-[2.5]">
                <div className="relative aspect-video">
                    <div className="absolute inset-0 flex items-center justify-center gap-28">
                        <div className="mt-10 w-28 aspect-square bg-indigo-600 rounded-full" />
                        <div className="mb-20 w-28 aspect-square bg-orange-600 rounded-full" />
                    </div>
                    <div className="flex backdrop-blur-3xl">
                        <div className="py-36 flex flex-col gap-10 z-10">
                            <div className="flex flex-col">
                                <div className="text-3xl font-semibold tracking-tight">Sign in</div>
                                <div className="text-3xl font-semibold tracking-tight">to SinglePoint</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">If you dont have an account, you can <span className="underline">register</span> here</div>
                            </div>
                        </div>
                        <div className="bg-transparent flex flex-1 items-center">
                            <img className="scale-75 object-fill" src={happy_male_character} />
                        </div>
                    </div>
                </div>
                {/* <Image className="h-[526px]" src="https://lp-cms-production.imgix.net/news/2018/06/Brunei-rainforest.jpg" /> */}
            </div>
            <div className="relative flex-1">
                <div className="xl:hidden absolute inset-0 flex items-center justify-center gap-28">
                    <div className="mt-10 w-28 aspect-square bg-indigo-200 rounded-full" />
                    <div className="mb-20 w-28 aspect-square bg-orange-200 rounded-full" />
                </div>
                <div className="backdrop-blur-3xl px-4 xl:px-0">
                    <div className="xl:hidden py-10 pb-16 flex flex-col items-center gap-1">
                        <SiPronounsdotpage size={45} />
                        <div className="text-xl text-gray-700 font-bold tracking-tighter text-balance">Sign in to SinglePoint</div>
                    </div>
                    <RemixFormProvider { ...methods }>
                        <Form method="POST" onSubmit={methods.handleSubmit}>
                            <div className="space-y-2">
                                { isError(fetcher.data) && (
                                    <div className="min-h-12 xl:min-h-10 flex items-center px-3 py-1 bg-red-100 text-sm text-red-600 font-semibold tracking-tight ring-1 ring-red-600 rounded-lg">
                                        { fetcher.data.errors.map(error => (
                                            <div key={error.id}>{ error.message }</div>
                                        )) }
                                    </div>
                                ) }
                                <div>
                                    <TextField name="email" label="Email" placeholder="Enter your email here. Eg: user@gmail.com" />
                                    <TextField name="password" label="Password" placeholder="Enter your password here. Eg: •••••••••" secureTextEntry />
                                </div>
                                <div className="pb-2 flex justify-between">
                                    <Checkbox name="rememberMe" label="Remember me" />
                                    <Button variant="link">Forget password?</Button>
                                </div>
                                <div className="space-y-2">
                                    <Button isLoading={methods.formState.isLoading || methods.formState.isSubmitting} fullWidth>Sign in to your account</Button>
                                    <NavLink className="block" to="/auth/register">
                                        <Button type="button" variant="link" className="h-12" fullWidth>Don't have an account? Signup here</Button>
                                    </NavLink>
                                </div>
                            </div>
                        </Form>
                    </RemixFormProvider>
                </div>
            </div>
        </div>
    );
};

export default Page;