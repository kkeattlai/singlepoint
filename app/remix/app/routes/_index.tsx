import React from "react";
import { useLoaderData } from "@remix-run/react";
import { type MetaFunction, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/services/db.server";

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

	// console.log(JSON.stringify(
	// 	await prisma.product.findMany({
	// 		include: {
	// 			images: true,
	// 			variants: {
	// 				include: {
	// 					options: true
	// 				}
	// 			}
	// 		}
	// 	})
	// , null, 4));
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