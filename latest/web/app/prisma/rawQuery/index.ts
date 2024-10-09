import { prisma } from "~/services/db.server";
import { Category, Prisma } from "@prisma/client";

export const getCategoryParent = async (id: string) => {
    return await prisma.$queryRaw<Category[]>`
        WITH RECURSIVE ancestor AS (
            SELECT
                id,
                image_url,
                name,
                description,
                sort,
                parent,
                created_at,
                updated_at
            FROM
                "Category"
            WHERE
                "Category".id = ${id}

            UNION ALL

            SELECT
                c.id,
                c.image_url,
                c.name,
                c.description,
                c.sort,
                c.parent,
                c.created_at,
                c.updated_at
            FROM
                "Category" c
            INNER JOIN
                ancestor a ON c.id = a.parent
        ) SELECT * FROM ancestor;
    `;
};
export const getCategoryLeaf = async (id: string) => {
    return await prisma.$queryRaw<Category[]>`
        WITH RECURSIVE descendant AS (
            SELECT
                id,
                image_url,
                name,
                description,
                sort,
                parent,
                created_at,
                updated_at
            FROM
                "Category"
            WHERE
                "Category".id = ${id}

            UNION
                SELECT
                    c.id,
                    c.image_url,
                    c.name,
                    c.description,
                    c.sort,
                    c.parent,
                    c.created_at,
                    c.updated_at
                FROM
                    "Category" c
                INNER JOIN
                    descendant d ON d.id = c.parent

        ) SELECT * FROM descendant;
    `;
};

export const getCategoryMultipleLeaf = async (ids: string[]) => {
    return await prisma.$queryRaw<Category[]>`
        WITH RECURSIVE descendant AS (
            SELECT
                id,
                image_url,
                name,
                description,
                sort,
                parent,
                created_at,
                updated_at
            FROM
                "Category"
            WHERE
                "Category".id IN (${Prisma.join(ids)})

            UNION
                SELECT
                    c.id,
                    c.image_url,
                    c.name,
                    c.description,
                    c.sort,
                    c.parent,
                    c.created_at,
                    c.updated_at
                FROM
                    "Category" c
                INNER JOIN
                    descendant d ON d.id = c.parent

        ) SELECT * FROM descendant;
    `;
};