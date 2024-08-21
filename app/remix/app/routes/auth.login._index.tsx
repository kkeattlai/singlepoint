import React from "react";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { withZod } from "@rvf/zod";
import { TbLock, TbMail } from "react-icons/tb";
import { FormProvider, useForm, validationError } from "@rvf/remix";
import { json, useFetcher, useLoaderData } from "@remix-run/react";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

import { useCredential } from "~/services/credential.server";
import Button from "~/components/Button";
import Checkbox from "~/components/Checkbox";
import TextField from "~/components/TextField";
import { prisma } from "~/services/db.server";
import { useAuthToken } from "~/services/auth.server";

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
        <FormProvider scope={form.scope()}>
            <fetcher.Form className="p-4 space-y-6" { ...form.getFormProps() }>
                <div className="space-y-1">
                    <TextField name="email" label="Email" placeholder="Enter your email here. Eg: user@gmail.com" leadingIcon={<TbMail />} fullWidth />
                    <TextField name="password" label="Password" placeholder="Enter your password here. Eg: ********" leadingIcon={<TbLock />} fullWidth secureTextEntry />
                    <div className="w-full flex justify-between">
                        <Checkbox name="rememberMe" label="Remember me" />
                        <Button variant="link">Forget your password?</Button>
                    </div>
                </div>
                <Button variant="contained" color="primary" fullWidth>Login to your account</Button>
            </fetcher.Form>
        </FormProvider>
    );
};

export default Page;