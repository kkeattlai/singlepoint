import React from "react";
import { z } from "zod";
import { useFetcher } from "@remix-run/react";
import { ValidatedForm, useField } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

import { action as uploadAction } from "./test.others";

const MAXIMUM_FILE_SIZE = 5 * 1000 * 1000; // 5MB
const ACCEPTED_MIME_TYPES = [ "image/gif", "image/jpg", "image/jpeg", "image/png" ];

const validationSchema = z.object({
    files: z.instanceof(File).transform(file => [ file ]).or(
        z.array(
            z.instanceof(File)
        )
    ).refine(value =>
        value.every(file => file.size <= MAXIMUM_FILE_SIZE),
        "The provided files is more than 5mb"
    ).refine(value =>
        value.every(file => ACCEPTED_MIME_TYPES.includes(file.type)),
        "The provided files is not supported."
    )
});

export const validator = withZod(validationSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
    // const result = await validator.validate(await request.formData());

    // if (result.error) return validationError(result.error, result.submittedData);

    return {};
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return {
        type: "success" as const,
        data: {
            message: "ok"
        }
    };
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const fetcher = useFetcher<typeof uploadAction>();
    const formRef = React.useRef<HTMLFormElement>(null);
    const uploadRef = React.useRef<HTMLInputElement>(null);
    const submitRef = React.useRef<HTMLButtonElement>(null);
    const { error } = useField("files", { formId: "file-upload" });

    const handleOnUpload = () => {
        uploadRef.current && uploadRef.current.click();
    };

    const handleOnSubmit = () => {
        // submitRef.current && submitRef.current.click();
        // formRef.current?.requestSubmit();
    };

    return (
        // <RemixFormProvider { ...methods }>
        //     <Form method="POST" encType="multipart/form-data" onSubmit={methods.handleSubmit}>
        //         <input { ...methods.register("files") } type="file"
        //         // onChange={(e) => {
        //         //     console.log("changed");
        //         //     console.log(Array.from(e.target.files ?? []));
        //         //     methods.setValue("files", Array.from(e.target.files ?? []))
        //         // }}
        //          />
        //         <button type="submit">submit</button>
        //     </Form>
        // </RemixFormProvider>
        <ValidatedForm action="/test/others" id="file-upload" method="POST" validator={validator} fetcher={fetcher} encType="multipart/form-data"> 
            <input ref={uploadRef} type="file" name="files" onChange={handleOnSubmit} multiple />
            { error && (
                <div>{ error }</div>
            ) }
            <button type="button" onClick={handleOnUpload}>Upload</button>
            <button ref={submitRef} type="submit" className="">submit</button>
        </ValidatedForm>
    );
};

export default Page;