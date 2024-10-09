import React from "react";
import { z } from "zod";
import { Form, NavLink, useLoaderData } from "@remix-run/react";
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { withZod } from "@rvf/zod";

import Button from "~/components/Button";
import TextField from "~/components/TextField";
import ComboBox from "~/components/ComboBox";
import { FormProvider } from "@rvf/remix";
import { useForm } from "@rvf/react";

import ComboBoxForm from "~/components/Form/ComboBox";
import Carousel from "~/components/Carousel";
import { prisma } from "~/services/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
    return {};
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return {
        type: "success" as const,
        data: {
            products: await prisma.product.findMany({
                include: {
                    images: true
                }
            })
        }
    };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const loaderData = useLoaderData<typeof loader>();
    // const form = useForm({
    //     validator: withZod(z.object({
    //         name: z.string()
    //     })),
    //     defaultValues: {
    //         name: ""
    //     }
    // });

    // React.useEffect(() => {
    //     form.subscribe.value("name", (values) => {
    //         console.log({ values });
    //     });
    // }, []);

    return (
        loaderData.data.products.map(product => (
            <NavLink to={`/product?id=${product.id}`}>
                { product.name }
            </NavLink>
        ))
        // <div className="p-01">
        //     <TextField label="Email" placeholder="Enter your password here. Eg: ********" />
        //     <TextField label="Password" placeholder="Enter your password here. Eg: ********" secureTextEntry />
        //     <ComboBox.Base
        //         defaultItems={[
        //             { id: "1", name: "asd" },
        //             { id: "2", name: "asd" },
        //             { id: "3", name: "asd" }
        //         ]}
        //         onSelectionChange={console.log}
        //     >
        //         { (items) => (
        //             <ComboBox.Item>{ items.name }</ComboBox.Item>
        //         ) }
        //     </ComboBox.Base>
        //     <Carousel images={[
        //         { id: "1", url: "https://images.unsplash.com/photo-1721332154373-17e78d19b4a4?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        //         { id: "2", url: "https://images.unsplash.com/photo-1721332154373-17e78d19b4a4?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        //         { id: "3", url: "https://images.unsplash.com/photo-1721332154373-17e78d19b4a4?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        //         { id: "4", url: "https://images.unsplash.com/photo-1721332154373-17e78d19b4a4?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
        //         { id: "5", url: "https://images.unsplash.com/photo-1721332154373-17e78d19b4a4?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },                
        //     ]} thumbPadding="p-10" />
        //     <Button variant="link" color="secondary">Submit</Button>
        //     <FormProvider scope={form.scope()}>
        //         <Form { ...form.getFormProps() }>
        //             <ComboBoxForm.Base
        //                 name="name"
        //                 defaultItems={[
        //                     { id: 1, name: "asd" },
        //                     { id: 2, name: "asasdaksdlasdd" }
        //                 ]}
        //             >
        //                 { item => (
        //                     <ComboBox.Item>{ item.name }</ComboBox.Item>
        //                 ) }
        //             </ComboBoxForm.Base>
        //         </Form>
        //     </FormProvider>
        // </div>
    );
};

export default Page;