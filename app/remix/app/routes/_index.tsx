import React from "react";
import { useLoaderData } from "@remix-run/react";
import { type MetaFunction, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	];
};

export const action = async ({ request }: ActionFunctionArgs) => {
	return {};
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return {};
};

type PageProps = {
	
};

const Page: React.FC<PageProps> = () => {
	const loaderData = useLoaderData<typeof loader>();

	return (
		<div></div>
	);
};

export default Page;