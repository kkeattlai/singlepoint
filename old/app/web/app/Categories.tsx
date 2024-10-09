import React from "react";
import { SerializeFrom } from "@remix-run/node";
import { useLoaderData, useLocation, useNavigate, useSearchParams } from "@remix-run/react";
import { TbChevronDown, TbMinus } from "react-icons/tb";

import Button from "~/components/Button";
import { cn } from "~/components/utils";

import { loader } from "./root";

type CategoryListProps = {
    category: SerializeFrom<typeof loader>["data"]["categories"]["all"][number];
    onClick?: () => void;
};

const CategoryList: React.FC<CategoryListProps> = ({ category, onClick }) => {
    const loaderData = useLoaderData<typeof loader>();
    const navigate = useNavigate();
    const location = useLocation();
    const [ searchParams, setSearchParams ] = useSearchParams();
    const [ isOpen, setIsOpen ] = React.useState<boolean>(!!loaderData.data.categories.breadcrumbs.find(breadcrumb => breadcrumb.id === category.id));
    const [ isSelected, setIsSelected ] = React.useState<boolean>(!!loaderData.data.categories.breadcrumbs.find(breadcrumb => breadcrumb.id === category.id));

    const handleOnListClick  = () => {
        onClick && onClick();

        location.pathname === "products" ?
            setSearchParams(param => {
                category.id ? param.set("categoryId", category.id) : param.delete("categoryId");

                return param;
            }, { replace: true, preventScrollReset: true }) :
            navigate(`/products?categoryId=${category.id}`);
    };

    const handleOnToggleExpand = () => {
        setIsOpen(isOpen => !isOpen);
    };

    React.useEffect(() => {
        setIsSelected(!!loaderData.data.categories.breadcrumbs.find(breadcrumb => breadcrumb.id === category.id));
    }, [ loaderData.data.categories.breadcrumbs ]);

    return (
        <div>
            <div className="relative h-10 px-3 flex items-center gap-1 text-sm text-gray-600 font-medium tracking-tight rounded-lg cursor-pointer">
                <div className="h-10 flex flex-1 items-center gap-3" onClick={handleOnListClick}>
                    <span
                        className={
                            cn(
                                "text-gray-500 active:text-gray-700 active:opacity-50",
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
                    <RecursiveCategories categories={category.categories} onClick={onClick} />                    
                </div>
            ) }
        </div>
    );
};

type RecursiveCategoriesProps = {
    categories: SerializeFrom<typeof loader>["data"]["categories"]["all"];
    onClick?: () => void;
};

const RecursiveCategories: React.FC<RecursiveCategoriesProps> = ({ categories, onClick }) => {
    return (
        categories.map(category => (
            <CategoryList key={category.id} category={category} onClick={onClick} />
        ))
    );
};

type CategoriesProps = {
    categories: SerializeFrom<typeof loader>["data"]["categories"]["all"];
    onClick?: () => void;
};

const Categories: React.FC<CategoriesProps> = ({ categories, onClick }) => {
    return (
        <RecursiveCategories categories={categories} onClick={onClick} />
    );
};

export default Categories;