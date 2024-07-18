import React from "react";
import { useLoaderData } from "@remix-run/react";
import { type MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [
		{ title: "SinglePoint" },
		{ name: "description", content: "Welcome to SinglePoint!" },
	];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return {};
};

type PageProps = {
	
};

const Page: React.FC<PageProps> = () => {
	return (
		<div className="text">Hi from index</div>
	);
};

export default Page;