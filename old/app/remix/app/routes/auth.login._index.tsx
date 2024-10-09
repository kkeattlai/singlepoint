import React from "react";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { withZod } from "@rvf/zod";
import { TbLock, TbMail } from "react-icons/tb";
import { SiPronounsdotpage } from "react-icons/si";
import { FormProvider, useForm, validationError } from "@rvf/remix";
import { json, NavLink, useFetcher, useLoaderData } from "@remix-run/react";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

import { prisma } from "~/services/db.server";
import { useAuthToken } from "~/services/auth.server";
import { useCredential } from "~/services/credential.server";
import Button from "~/components/Button";
import Checkbox from "~/components/Checkbox";
import TextField from "~/components/TextField";

import happy_male_character from "../../public/happy_male_character.png";

const validationSchema = zfd.formData({
    email: zfd.text(
        z.string({
            required_error: "Email is required."
        }).email("The provided email is invalid. Eg: user@gmail.com"),
    ),
    password: zfd.text(
        z.string({
            required_error: "Password is required."
        })
    ),
    rememberMe: zfd.checkbox()
    // password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "The provided password is invalid. It must be at least 8 characters long and include at least one letter, one number, and one special character."),
});

type FormData = z.infer<typeof validationSchema>;

const validator = withZod(validationSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
    const result = await validator.validate(await request.formData());

    if (result.error) return validationError(result.error, result.submittedData);

    const { email, password, rememberMe } = result.data;

    const user = await prisma.user.findFirst({
        where: { email }
    });

    if (!user) {
        return validationError({
            fieldErrors: {
                root: "The email / password is incorrect.",
            }
        }, result.submittedData);
    }

    if (!await bcrypt.compare(password, user.password)) {
        return validationError({
            fieldErrors: {
                root: "The email / password is incorrect.",
            }
        }, result.submittedData);
    }

    if (user.isBlocked) {
        return validationError({
            fieldErrors: {
                root: "The email has been blocked. Please contact SinglePoint's support."
            }
        }, result.submittedData);
    }

    return json({
        type: "success" as const,
        data: {
            ...result.data
        }
    }, {
        headers: [
            await useAuthToken.create(user.id),
            await useCredential.create({ email, password, rememberMe }),
        ]
    });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await useAuthToken.parse(request);
    const credential = await useCredential.parse(request);

    if (user) return redirect("/dashboard");

    return {
        type: "success" as const,
        data: {
            ...credential ? {
                form: {
                    defaultValues: {
                        ...credential
                    } satisfies FormData
                }
            } : {}
        }
    };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const fetcher = useFetcher<typeof action>();
    const loaderData = useLoaderData<typeof loader>();
    const form = useForm({
        fetcher,
        validator,
        method: "POST",
        defaultValues: loaderData.data.form?.defaultValues ?? {
            email: "",
            password: "",
            rememberMe: false
        } satisfies FormData
    });

    return (
        <div className="container mx-auto space-y-4 lg:space-y-0 py-1 flex items-center gap-20">
            <div className="hidden lg:block lg:flex-[1.5] xl:flex-[2.25]">
                <div className="relative aspect-video">
                    <div className="absolute inset-0 flex items-center justify-center gap-28">
                        <div className="mt-10 w-28 aspect-square bg-indigo-600 rounded-full" />
                        <div className="mb-20 w-28 aspect-square bg-orange-600 rounded-full" />
                    </div>
                    <div className="flex flex-1 backdrop-blur-3xl">
                        <div className="px-4 py-36 flex flex-col gap-10 z-10">
                            <div className="flex flex-col">
                                <div className="text-3xl font-semibold tracking-tight">Sign in</div>
                                <div className="text-3xl font-semibold tracking-tight">to SinglePoint</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">If you dont have an account, you can <span className="underline">register</span> here</div>
                            </div>
                        </div>
                        <div className="bg-transparent flex flex-1 items-center">
                            <img className="lg:scale-110 xl:scale-75 object-fill" src={happy_male_character} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative flex-1">
                <div className="lg:hidden absolute inset-0 flex items-center justify-center gap-28">
                    <div className="mt-10 w-28 aspect-square bg-indigo-200 rounded-full" />
                    <div className="mb-20 w-28 aspect-square bg-orange-200 rounded-full" />
                </div>
                <div className="backdrop-blur-3xl px-4 lg:px-0">
                    <div className="lg:hidden py-10 pb-16 flex flex-col items-center gap-1">
                        <SiPronounsdotpage size={45} />
                        <div className="text-xl text-gray-700 font-bold tracking-tighter text-balance">Sign in to SinglePoint</div>
                    </div>
                    <FormProvider scope={form.scope()}>
                        <fetcher.Form className="lg:p-4 space-y-6" { ...form.getFormProps() }>
                            <div className="space-y-1">
                                <TextField name="email" label="Email" placeholder="Enter your email here. Eg: user@gmail.com" leadingIcon={<TbMail />} fullWidth />
                                <TextField name="password" label="Password" placeholder="Enter your password here. Eg: ********" leadingIcon={<TbLock />} fullWidth secureTextEntry />
                                <div className="w-full flex justify-between">
                                    <Checkbox name="rememberMe" label="Remember me" />
                                    <Button variant="link">Forget your password?</Button>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Button fullWidth="block">Login to your account</Button>
                                <NavLink to="/auth/register" className="h-12 md:h-10 flex items-center">
                                    <Button type="button" variant="link" fullWidth="block">Don't have an account yet? Register now</Button>
                                </NavLink>
                            </div>
                        </fetcher.Form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
};

export default Page;