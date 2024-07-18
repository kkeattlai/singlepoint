import React from "react";
import { z } from "zod";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, useLoaderData, useSearchParams } from "@remix-run/react";
import "./tailwind.css";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { AiOutlineUser, AiOutlineShopping } from "react-icons/ai";

import Button from "./components/Button";
import TextField from "./components/TextField";
import { queryString } from "./services/queryString.server";

const validationSchema = z.object({
	search: z.string()
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const parsedQueryString = await queryString.safeParse(request,
		z.object({
			search: z.string()
		})
	);

	return {
		type: "success" as const,
		data: {
			...parsedQueryString.data ? { search: parsedQueryString.data.search } : {}
		}
	}
};

export const Header: React.FC = () => {
	const loaderData = useLoaderData<typeof loader>();
	const [ searchParams, setSearchParams ] = useSearchParams();
	const methods = useRemixForm<z.infer<typeof validationSchema>>({
		defaultValues: {
			...loaderData.data.search ? { search: loaderData.data.search } : {}
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
		<div className="">
			<div className="container mx-auto">
				<div className="flex items-center justify-between gap-10 py-8">
					<NavLink to="/">
						<div className="text-2xl font-bold tracking-tighter">SinglePoint</div>
					</NavLink>
					<div className="flex items-center gap-8">
						<div className="w-[550px]">
							<RemixFormProvider { ...methods }>
								<TextField name="search" placeholder="What are you looking for today?" fullWidth hideDescription />
							</RemixFormProvider>
						</div>
						<Button variant="ghost" size="icon">
							<AiOutlineUser />
						</Button>
						<Button variant="ghost" size="icon">
							<AiOutlineShopping />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Header />
				{ children }
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
    );
};

const App: React.FC = () => <Outlet />;

export default App;