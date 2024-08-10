import React from "react";
import { motion } from "framer-motion";
import { SerializeFrom } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { TbChevronDown, TbMinus } from "react-icons/tb";

import Button from "~/components/Button";
import { cn } from "~/components/utils";

import { loader } from "../route";

type CategoryListProps = {
    breadcrumbs: SerializeFrom<typeof loader>["data"]["breadcrumbs"];
    category: SerializeFrom<typeof loader>["data"]["categories"][number];
};

const CategoryList: React.FC<CategoryListProps> = ({ breadcrumbs, category }) => {
    const loaderData = useLoaderData<typeof loader>();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ isOpen, setIsOpen ] = React.useState<boolean>(!!loaderData.data.breadcrumbs.find(breadcrumb => breadcrumb.id === category.id));
    const [ isSelected, setIsSelected ] = React.useState<boolean>(searchParams.get("categoryId") === category.id);

    isSelected && console.log({ id: category.id, isSelected });

    const handleOnListClick  = () => {
        setSearchParams(param => {
            category.id ? param.set("categoryId", category.id) : param.delete("categoryId");

            return param;
        }, { replace: true, preventScrollReset: true });
    };

    const handleOnToggleExpand = () => {
        setIsOpen(isOpen => !isOpen);
    };

    React.useEffect(() => {
        setIsSelected(searchParams.get("categoryId") === category.id);
    }, [ searchParams.get("categoryId") ]);

    React.useEffect(() => {
        !isOpen && loaderData.data.breadcrumbs.find(breadcrumb => breadcrumb.id === category.id) &&
            setSearchParams(param => {
                category.id ? param.set("categoryId", category.id) : param.delete("categoryId");

                return param;
            }, { replace: true, preventScrollReset: true });
    }, [ isOpen ]);

    return (
        <div>
            <div className="relative h-10 flex items-center gap-1 text-sm text-gray-600 font-medium tracking-tight rounded-lg cursor-pointer z-10">
                { isSelected && (
                    <motion.div
                        key={category.id}
                        layoutId="isSelectCategory"
                        className="absolute inset-0 bg-gray-100 -z-10 rounded-lg"
                    />
                ) }
                <div className="h-10 px-3 flex flex-1 items-center gap-3" onClick={handleOnListClick}>
                    <span
                        className={
                            cn(
                                "text-gray-500 transition",
                                { "text-gray-900": isSelected }
                            )
                        }
                    >{ category.name }</span>
                    { category._count.products !== undefined && category._count.products > 0 && (
                        <div className="px-2 py-0.5 text-[10px] bg-sky-100 text-sky-600 rounded">{ category._count.products }</div>
                    ) }
                </div>
                { category.categories.length > 0 && (
                    <Button type="button" variant="ghost" size="icon" onClick={handleOnToggleExpand}>
                        { isOpen ? (
                            <TbMinus />
                        ) : (
                            <TbChevronDown />
                        ) }
                    </Button>
                ) }
            </div>
            { isOpen && category.categories.length > 0 && (
                <div className="pl-6">
                    <RecursiveCategories categories={category.categories} breadcrumbs={breadcrumbs} />                    
                </div>
            ) }
        </div>
    );
};

type RecursiveCategoriesProps = {
    breadcrumbs: SerializeFrom<typeof loader>["data"]["breadcrumbs"];
    categories: SerializeFrom<typeof loader>["data"]["categories"];
};

const RecursiveCategories: React.FC<RecursiveCategoriesProps> = ({ breadcrumbs, categories }) => {
    return (
        categories.map(category => (
            <CategoryList key={category.id} category={category} breadcrumbs={breadcrumbs} />
        ))
    );
};

type CategoriesProps = {
    breadcrumbs: SerializeFrom<typeof loader>["data"]["breadcrumbs"];
    categories: SerializeFrom<typeof loader>["data"]["categories"];
};

const Categories: React.FC<CategoriesProps> = ({ breadcrumbs, categories }) => {
    return (
        <div className="space-y-3">
            <div className="py-1 text-sm font-bold tracking-tighter uppercase">Categories</div>
            <div>
                <RecursiveCategories categories={categories} breadcrumbs={breadcrumbs} />
            </div>
        </div>
    );
};

export default Categories;