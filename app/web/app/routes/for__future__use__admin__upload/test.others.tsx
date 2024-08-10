import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { validationError } from "remix-validated-form";
import { type ActionFunctionArgs } from "@remix-run/node";

import { prisma } from "~/services/db.server";

import { validator } from "./test";

const FILE_TYPES = {
    "image/gif": "gif",
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png"
} as Record<string, string>;

export const action = async ({ request }: ActionFunctionArgs) => {
    const result = await validator.validate(await request.formData());

    if (result.error) return validationError(result.error, result.submittedData);

    const { files } = result.data;

    console.log(await Promise.all(
        files.map(async (file, index) => {
            const uuid = uuidv4();
            const directory = `${import.meta.dirname}/../../public`;
            const filename = `${uuid}.${FILE_TYPES[file.type]}`;
            const relativeFilepath = `${directory}/${filename}`;
            const url = `/public/${filename}`;

            try {
                await prisma.$transaction(async transaction => {
                    const buffer = Buffer.from(await file.arrayBuffer());

                    await fs.mkdir(directory, { recursive: true });
                    await fs.writeFile(relativeFilepath, buffer);

                    await transaction.productImage.create({
                        data: {
                            id: uuid,
                            url,
                            sort: index,
                            productId: "2d11f519-590e-47fe-a50c-2b88dbff6eca"
                        }
                    });

                    if (index === 1) throw new Error("opps");
                });
                
                return {
                    type: "success" as const,
                    data: {
                        message: `${filename} completed the upload.`
                    }
                };
            } catch (error) {
                await fs.unlink(relativeFilepath);

                return {
                    type: "error" as const,
                    data: {
                        message: `${filename} failed the upload.`
                    }
                };
            }
        })
    ));

    return {};
};