import React from "react";
import { z } from "zod";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { json, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";

import { useFavourite } from "~/services/favourite.server";
import { getValidatedFormData, validationError } from "~/utils/index.server";
import TextField from "~/components/Form/TextField";
import SelectField from "~/components/Form/SelectField";

const validationSchema = z.object({
    id: z.string(),
    destinationId: z.string(),
    _action: z.enum([ "addToFavourite", "removeFromFavourite" ])
});

type ValidationSchema = z.infer<typeof validationSchema>;

export const action = async ({ request }: ActionFunctionArgs) => {
    const favourites = await useFavourite.parse(request);
    // const result = await withZod(validationSchema).validate(await request.formData());
    // const result = await getValidatedFormData(request, validationSchema);
    const result = await getValidatedFormData(request, validationSchema);

    // if (result.error) return validationError(result.error, result.submittedData);
    if (result.errors) return validationError(result.errors, result.receivedValues);

    console.log(result.data.id);
    // const { id, _action } = result.data;
    // console.log({ id, _action });

    // if (favourites.length <= 0) {
    if (favourites.length <= 0) {

        console.log("add ?");
        // console.log(favourites.filter(favourite => favourite.id !== id));
        // console.log({ add: [ ...favourites.filter(favourite => favourite.id !== id), { id } ] });
        return json({

        }, {
            headers: [
                await useFavourite.create([ ...favourites.filter(favourite => favourite.id !== "asdasd"), { id: 'asdasd' } ])
            ]
        });
    }

    // if (favourites.length > 0) {
    if (favourites.length > 0) {
        console.log("remove ?");
        // console.log({ remove: [ ...favourites.filter(favourite => favourite.id !== id) ] });
        return json({

        }, {
            headers: [
                await useFavourite.create([ ...favourites.filter(favourite => favourite.id !== "asdasd") ])
            ]
        });
    }

    

    return json({

    });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const favourites = await useFavourite.parse(request);
    console.log({ favourites });

    console.log(request.headers.get("Cookie"))

    return {
        favourites
    };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const fetcher = useFetcher<typeof action>();
    const loaderData = useLoaderData<typeof loader>();

    const methods = useRemixForm<z.infer<typeof validationSchema>>({
        fetcher,
        defaultValues: {
            id: "a",
            destinationId: "asd"
        }
    });

    return (
        typeof window === undefined ? (
            <div>NO js</div>
        ) : (
            <RemixFormProvider { ...methods }>
                <fetcher.Form method="POST">
                    <input { ...methods.register("id") } />
                    <TextField name="id" />
                    <SelectField.Base name="destinationId">
                        <SelectField.Item key="asd">ASD</SelectField.Item>
                    </SelectField.Base>
                    <div>
                        { methods.formState.errors.id?.message }
                    </div>
                    <button type="submit">Submit</button>
                </fetcher.Form>
            </RemixFormProvider>
        )
    );
};

export default Page;