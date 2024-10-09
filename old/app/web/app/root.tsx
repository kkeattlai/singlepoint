import React from "react";
import { z } from "zod";
import { SerializeFrom, type LoaderFunctionArgs } from "@remix-run/node";
import { isRouteErrorResponse, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteError, useRouteLoaderData, useSearchParams } from "@remix-run/react";
import "./tailwind.css";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { AiOutlineUser, AiOutlineShopping, AiOutlineMenu } from "react-icons/ai";

import Drawer from "./components/Drawer";
import Button from "./components/Button";
import TextField from "./components/TextField";
import { recursive } from "./utils";
import { prisma } from "./services/db.server";
import { queryString } from "./services/queryString.server";
import { getCategoryParent } from "./prisma/rawQuery";

import Categories from "./Categories";

const validationSchema = z.object({
	search: z.string()
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const parsedQueryString = await queryString.safeParse(request,
		z.object({
			search: z.string().optional(),
            categoryId: z.string().optional(),
		})
	);

    const categoryParentIds = parsedQueryString.data && parsedQueryString.data.categoryId && (await getCategoryParent(parsedQueryString.data?.categoryId)).reverse().map(category => ({ id: category.id, name: category.name })) || [];

	const category = await prisma.category.findMany({
        include: {
            _count: {
                select: {
                    products: true
                }
            }
        },
        orderBy: {
            sort: "asc"
        }
    });

	return {
		type: "success" as const,
		data: {
			...parsedQueryString.success ? {
				...parsedQueryString.data.search ? { search: parsedQueryString.data.search } : {},
			} : {},
			categories: {
				breadcrumbs: categoryParentIds,
				all: recursive(category, null),
			}
		}
	};
};

type MenuButtonProps = {
	// categories: SerializeFrom<typeof loader>["data"]["categories"]["all"];
};

const MenuButton: React.FC<MenuButtonProps> = () => {
	const loaderData = useLoaderData<typeof loader>();
	const [ isOpen, setIsOpen ] = React.useState<boolean>(false);

	const handleOnToggleDrawer = () => {
		setIsOpen(isOpen => !isOpen);
	};

	console.log(loaderData);

	return (
		<div className="lg:hidden">
			<Button type="button" variant="ghost" size="icon" onClick={handleOnToggleDrawer}>
				<AiOutlineMenu />
			</Button>
			<Drawer anchor="left" isOpen={isOpen} setIsOpen={setIsOpen}>
				<div className="w-full flex flex-col gap-2 p-2">
					<div className="h-12 px-2 flex items-center text-lg font-semibold tracking-tight">SinglePoint</div>
					<div className="flex-1">
						<Categories categories={loaderData.data.categories.all} onClick={handleOnToggleDrawer} />
					</div>
					<div className="text-xs font-bold tracking-tight">&copy; 2024 Powered by SinglePoint</div>
				</div>
			</Drawer>
		</div>
	);
};

export const Header: React.FC = () => {
	const [ searchParams, setSearchParams ] = useSearchParams();
	const methods = useRemixForm<z.infer<typeof validationSchema>>({
		defaultValues: {
			// ...loaderData.data.search ? { search: loaderData.data.search } : {}
			search: "" 
		}
	});

	React.useEffect(() => {
		methods.watch(({ search }) => {
			setSearchParams(param => {
				search ? param.set("search", search) : param.delete("search");

				return param;
			})
		});
	}, [ methods.watch ]);

	return (
		<div className="sticky top-0 bg-white bg-opacity-80 backdrop-blur z-10">
			<div className="container mx-auto flex items-center justify-between gap-10 p-1.5 lg:px-0 lg:py-6">
				<div className="flex items-center gap-1.5">
					<MenuButton />
					<NavLink to="/">
						<div className="text-lg lg:text-2xl font-bold tracking-tighter">SinglePoint</div>
					</NavLink> 
				</div>
				<div className="flex items-center gap-2 lg:gap-8">
					<div className="hidden lg:block w-[550px]">
						<RemixFormProvider { ...methods }>
							<TextField name="search" placeholder="What are you looking for today?" fullWidth hideDescription />
						</RemixFormProvider>
					</div>
					<NavLink to="/auth/login">
						<Button variant="ghost" size="icon">
							<AiOutlineUser />
						</Button>
					</NavLink>
					<Button variant="ghost" size="icon">
						<AiOutlineShopping />
					</Button>
				</div>
			</div>
		</div>
	);
};

type FooterProps = {

};

const Footer: React.FC<FooterProps> = () => {
	return (
		<div className="container mx-auto">
			<div className="h-40">
				<div className="flex-[5]">
					<div className="text-xl font-bold tracking-tight">SinglePoint</div>
					<div className="text-xs text-gray-400">Digitally transforming how we do online shopping in Brunei.</div>
				</div>
				<div className="flex-[1]"></div>
			</div>
		</div>
	);
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{/* { children } */}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
    );
};

function Error() {
	return (
		<div>Error</div>
	);
};

const App: React.FC = () => {
	const loaderData = useLoaderData<typeof loader>();

	return (
		<div>asd</div>
		// <div className="flex flex-col min-h-dvh">
		// 	<Header />
		// 	<div className="flex-1">
		// 		<Outlet />
		// 	</div>
		// 	{/* <Footer /> */}
		// </div>
	);
};

export default App;