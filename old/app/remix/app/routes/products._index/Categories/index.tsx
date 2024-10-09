import React from "react";
import { motion } from "framer-motion";
import { SerializeFrom } from "@remix-run/node";
import { useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { TbChevronDown, TbMinus } from "react-icons/tb";

import Button from "~/components/Button";
import { cn } from "~/components/utils";

import { loader } from "../route";

type CategoryListProps = {
    breadcrumbs: SerializeFrom<typeof loader>["data"]["breadcrumbs"];
    category: SerializeFrom<typeof loader>["data"]["categories"][number];
};

const CategoryList: React.FC<CategoryListProps> = ({ breadcrumbs, category }) => {
    const navigation = useNavigation();
    const loaderData = useLoaderData<typeof loader>();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ isOpen, setIsOpen ] = React.useState<boolean>(!!loaderData.data.breadcrumbs.find(breadcrumb => breadcrumb.id === category.id));
    const [ isSelected, setIsSelected ] = React.useState<boolean>(searchParams.get("categoryId") === category.id);

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
        navigation.state === "idle" && setIsSelected(searchParams.get("categoryId") === category.id);
    }, [ navigation.state ]);

    React.useEffect(() => {
        !isOpen && loaderData.data.breadcrumbs.find(breadcrumb => breadcrumb.id === category.id) &&
            setSearchParams(param => {
                category.id ? param.set("categoryId", category.id) : param.delete("categoryId");

                return param;
            }, { replace: true, preventScrollReset: true });
    }, [ isOpen ]);

    return (
        category._count.products > 0 && (
            <div>
                <div
                    className={
                        cn(
                            "h-10 flex items-center gap-1 rounded-lg cursor-pointer z-10 hover:bg-gray-50 active:bg-gray-100 transition",
                            { "bg-gray-200 hover:bg-gray-200 active:bg-gray-200": isSelected }
                        )
                    }
                >
                    <div className="h-10 px-3 flex flex-1 items-center gap-3" onMouseUp={handleOnListClick}>
                        <span
                            className={
                                cn(
                                    "text-sm text-gray-400 transition",
                                    { "text-gray-900": isSelected }
                                )
                            }
                        >{ category.name }</span>
                        { category._count.products !== undefined && category._count.products > 0 && (
                            <div className="px-2 py-0.5 text-[10px] bg-sky-100 text-sky-600 rounded">{ category._count.products }</div>
                        ) }
                    </div>
                    { category.categories.length > 0 && (
                        <Button className="lg:size-8 m-1" type="button" variant="ghost" color="transparent" size="icon" onPress={handleOnToggleExpand}>
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
        )
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
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ isSelected, setIsSelected ] = React.useState<boolean>(false);

    const handleOnClearCategoryId = () => {
        setSearchParams(param => {
            param.delete("categoryId");

            return param;
        });
    };

    React.useEffect(() => {
        setIsSelected(!!searchParams.get("categoryId"))
    }, [ searchParams ]);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="py-1 text-sm font-bold tracking-tighter uppercase">Categories</div>
                { isSelected && (
                    <Button type="button" variant="link" onPress={handleOnClearCategoryId}>Clear</Button>
                ) }
            </div>
            <div>
                <RecursiveCategories categories={categories} breadcrumbs={breadcrumbs} />
            </div>
        </div>
    );
};

export default Categories;