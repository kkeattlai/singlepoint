import React from "react";
import { NavLink, useLoaderData } from "@remix-run/react";
import { type MetaFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { TbLeaf, TbTruckDelivery, TbCreditCard } from "react-icons/tb";
import { AiTwotoneSafetyCertificate } from "react-icons/ai";

import Image from "~/components/Image";
import Button from "~/components/Button";
import FlatList from "~/components/FlatList";
import { prisma } from "~/services/db.server";

import landing_lg from "../../public/landing_page_lg.jpg";
import landing_sm from "../../public/landing_page_sm.jpg";
import Guranteed from "./_index/Guranteed";

export const meta: MetaFunction = () => {
	return [
		{ title: "SinglePoint" },
		{ name: "description", content: "Welcome to SinglePoint!" },
	];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return {
        type: "success" as const,
        data: {
            categories: await prisma.category.findMany({
                where: { parent: null }
            })
        }
    };
};

type PageProps = {
	
};

const Page: React.FC<PageProps> = () => {
    const loaderData = useLoaderData<typeof loader>();

	return (
        <div>asd</div>
		// <div>
		// 	<div className="relative hidden lg:block">
		// 		<img src={landing_lg} />
		// 		<div className="absolute inset-0">
		// 			<div className="container mx-auto h-full flex flex-col items-start justify-center gap-6">
		// 				<div className="flex flex-col">
		// 					<div className="text-2xl text-black font-bold tracking-tighter">Feeling creative ?</div>
		// 					<div className="text-sm text-gray-800 font-light tracking-tight">Designed for every writing style - and every brand, too.</div>
		// 				</div>
		// 				<NavLink to="/products">
		// 					<Button className="h-10">Shop now</Button>
		// 				</NavLink>
		// 			</div>
		// 		</div>
		// 	</div>
		// 	<div className="relative block lg:hidden">
		// 		<img src={landing_sm} className="object-cover md:aspect-2/1" />
		// 		<div className="absolute bottom-0 inset-x-0 pt-10 pb-12 flex flex-col items-center gap-6">
		// 			<div className="flex flex-col items-center">
		// 				<div className="text-lg text-black font-bold tracking-tight">Feeling creative ?</div>
		// 				<div className="text-sm text-gray-800 font-light tracking-tight">Designed for every writing style - and every brand, too.</div>
		// 			</div>
		// 			<NavLink to="/products">
		// 				<Button className="h-10">Shop now</Button>
		// 			</NavLink>
		// 		</div>
		// 	</div>
        //     <div className="lg:hidden container mx-auto py-10 space-y-3">
        //         <div className="px-4 font-bold tracking-tight uppercase">Popular categories</div>
        //         <FlatList>
        //             { loaderData.data.categories.map(category => (
        //                 // category._count.products >= 0 && (
        //                     <div key={category.id} className="px-4 flex-none w-full space-y-1">
        //                         <NavLink to={`/products?categoryId=${category.id}`} className="space-y-3">
        //                             <Image className="w-full aspect-video rounded-lg" src={category.imageUrl} />
        //                             <div className="outline-none focus:ring-2 ring-offset-2 ring-indigo-600 rounded">
        //                                 <div className="font-semibold tracking-tight">{ category.name }</div>  
        //                                 <div className="text-xs text-gray-400 line-clamp-3">{ category.description }</div>                                    
        //                             </div>
        //                             <Button variant="link">Browse { category.name }</Button>
        //                         </NavLink>
        //                     </div>
        //                 // )
        //             )) }
		// 	    </FlatList>
        //     </div>
		// 	<div className="hidden container mx-auto py-24 lg:flex flex-col gap-4">
        //         <div className="font-bold tracking-tight uppercase">Shop by categories</div>
        //         <div className="-mx-5 flex no-scrollbar overflow-x-scroll">
        //             { loaderData.data.categories.map(category => (
        //                 // category._count.products >= 0 && (
        //                     <div key={category.id} className="flex-none w-1/5 lg:w-1/4 px-5 space-y-1 cursor-pointer hover:opacity-80 transition">
        //                         <NavLink to={`/products?categoryId=${category.id}`} className="space-y-3">
        //                             <Image className="w-full aspect-video rounded-lg" src={category.imageUrl} />
        //                             <div className="outline-none focus:ring-2 ring-offset-2 ring-indigo-600 rounded">
        //                                 <div className="font-semibold tracking-tight">{ category.name }</div>  
        //                                 <div className="text-xs text-gray-400 line-clamp-3">{ category.description }</div>                                    
        //                             </div>
        //                             <Button variant="link">Browse { category.name }</Button>
        //                         </NavLink>
        //                     </div>
        //                 // )
        //             )) }
        //         </div>
		// 	</div>
        //     <div className="py-10 bg-gray-100">
        //         <FlatList groupBy="lg">
        //             <Guranteed icon={<AiTwotoneSafetyCertificate size={50} />} title="Merchant verified" subtitle="Every merchant we allow on the platform has a strict standard of qualities to adhere." />
        //             <Guranteed icon={<TbTruckDelivery size={50} strokeWidth={1.5} />} title="Delivery to country wide" subtitle="No matter where you live, we will deliver right to your door step." />
        //             <Guranteed icon={<TbLeaf size={50} strokeWidth={1.5} />} title="We keep your receipt" subtitle="Don't need to keep a drawer full of receipt anymore. We just need your online copy." />
        //             <Guranteed icon={<TbCreditCard size={50} strokeWidth={1.5} />} title="Card payment accepted" subtitle="Payment is instant, secure and reliable." />
        //         </FlatList>
        //     </div>
        //     {/* <div className="hidden md:block lg:hidden py-10 bg-gray-100">
        //         <FlatList groupBy={2}>
        //             <Guranteed className="w-1/2" icon={<AiTwotoneSafetyCertificate size={50} />} title="Merchant verified" subtitle="Every merchant we allow on the platform has a strict standard of qualities to adhere." />
        //             <Guranteed className="w-1/2" icon={<TbTruckDelivery size={50} strokeWidth={1.5} />} title="Delivery to country wide" subtitle="No matter where you live, we will deliver right to your door step." />
        //             <Guranteed className="w-1/2" icon={<TbLeaf size={50} strokeWidth={1.5} />} title="We keep your receipt" subtitle="Don't need to keep a drawer full of receipt anymore. We just need your online copy." />
        //             <Guranteed className="w-1/2" icon={<TbCreditCard size={50} strokeWidth={1.5} />} title="Card payment accepted" subtitle="Payment is instant, secure and reliable." />
        //         </FlatList>
        //     </div>
        //     <div className="hidden lg:block xl:hidden py-10 bg-gray-100">
        //         <FlatList groupBy={3}>
        //             <Guranteed className="w-1/3" icon={<AiTwotoneSafetyCertificate size={50} />} title="Merchant verified" subtitle="Every merchant we allow on the platform has a strict standard of qualities to adhere." />
        //             <Guranteed className="w-1/3" icon={<TbTruckDelivery size={50} strokeWidth={1.5} />} title="Delivery to country wide" subtitle="No matter where you live, we will deliver right to your door step." />
        //             <Guranteed className="w-1/3" icon={<TbLeaf size={50} strokeWidth={1.5} />} title="We keep your receipt" subtitle="Don't need to keep a drawer full of receipt anymore. We just need your online copy." />
        //             <Guranteed className="w-1/3" icon={<TbCreditCard size={50} strokeWidth={1.5} />} title="Card payment accepted" subtitle="Payment is instant, secure and reliable." />
        //         </FlatList>
        //     </div>
        //     <div className="hidden xl:block py-20 bg-gray-100">
        //         <div className="container mx-auto flex">
        //             <Guranteed className="w-1/4" icon={<AiTwotoneSafetyCertificate size={50} />} title="Trusted, secure, and reliable" subtitle="Every merchant we allow on the platform has a strict standard of qualities to adhere." />
        //             <Guranteed className="w-1/4" icon={<TbTruckDelivery size={50} strokeWidth={1.5} />} title="Delivery to country wide" subtitle="No matter where you live, we will deliver right to your door step." />
        //             <Guranteed className="w-1/4" icon={<TbLeaf size={50} strokeWidth={1.5} />} title="We keep your receipt" subtitle="Don't need to keep a drawer full of receipt anymore. We just need your online copy." />
        //             <Guranteed className="w-1/4" icon={<TbCreditCard size={50} strokeWidth={1.5} />} title="Card payment accepted" subtitle="Payment is instant, secure and reliable." />
        //         </div>
        //     </div> */}
        //     <div className="container mx-auto py-20">
        //         <div className="text-sm font-semibold tracking-tight">&copy; 2023-2024 SinglePoint - All rights reserved.</div>
        //     </div>
		// </div>
	);
};

export default Page;