import React from "react";
import { Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";

import "./tailwind.css";
import Button from "./components/Button";
import { TbLogin2, TbMenu2, TbShoppingBag } from "react-icons/tb";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { AiOutlineLogin, AiOutlineShopping, AiOutlineUser } from "react-icons/ai";
import { useAuthToken } from "./services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const user = await useAuthToken.parse(request);

	return {
		type: "success" as const,
		data: {
			isAuthed: !!user
		}
	};
};

type LayoutProps = {

} & React.PropsWithChildren;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{ children }
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
};

type HeaderProps = {

};

const Header: React.FC<HeaderProps> = () => {
	const loaderData = useLoaderData<typeof loader>();

	return (
		<div className="">
			<div className="container mx-auto p-1 md:px-4 md:py-5 flex items-center gap-3">
				<Button variant="ghost" size="icon" color="transparent" className="md:hidden">
					<TbMenu2 />
				</Button>
				<NavLink to="/" className="flex-1">
					<div className="flex-1 text-lg md:text-xl font-bold tracking-tight">SinglePoint</div>
				</NavLink>
				<div className="flex items-center gap-3 lg:gap-8">
					{ loaderData.data.isAuthed ? (
						<NavLink to="/dashboard">
							<Button variant="ghost" size="icon" color="transparent">
								<AiOutlineUser />
							</Button>
						</NavLink>
					) : (
						<NavLink to="/auth">
							<Button variant="ghost" size="icon" color="transparent">
								<TbLogin2 />
							</Button>
						</NavLink>
					) }
					<NavLink to="/shopping-bag">
						<Button variant="ghost" size="icon" color="transparent">
							<TbShoppingBag />
						</Button>
					</NavLink>
				</div>
			</div>
		</div>
	);
};

const App: React.FC = () => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
};

export default App;