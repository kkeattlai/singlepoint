import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "~/components/utils";
import Details from "./Details";
import Reviews from "./Reviews";


const tabs = [ "Details", "Reviews" ] as const;
type Tabs = typeof tabs[number];

type ProductDetailsAndReviewsProps = {
    
};

const ProductDetailsAndReviews: React.FC<ProductDetailsAndReviewsProps> = () => {
    const [ currentTab, setCurrentTab ] = React.useState<Tabs>("Details");

    const handleOnSelectTab = (tab: Tabs) => () => setCurrentTab(tab);

    return (
        <div className="p-4">
            <div className="flex gap-10">
                { tabs.map(tab => (
                    <div key={tab} className="relative px-1.5 pb-1.5 cursor-pointer" onClick={handleOnSelectTab(tab)}>
                        <div
                            className={
                                cn(
                                    "text-sm text-gray-400 select-none transition",
                                    { "text-gray-900 font-semibold tracking-tight": currentTab === tab }
                                )
                            }
                        >{ tab }</div>
                        { currentTab === tab && (
                            <motion.div layoutId="tab_underline" className="absolute inset-x-0 bottom-0 h-1 bg-indigo-600 rounded-full" />
                        ) }
                    </div>
                )) }
            </div>
            <AnimatePresence mode="popLayout" initial={false}>
                { currentTab === "Details" ? (
                    <motion.div
                        key="Details"
                        className="min-h-[320px] py-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >

                        <Details />
                    </motion.div>
                ) : currentTab === "Reviews" ? (
                    <motion.div
                        key="Reviews"
                        className="min-h-[320px] py-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Reviews />
                    </motion.div>
                ) : (
                    null
                ) }
            </AnimatePresence>
        </div>
    );
};

export default ProductDetailsAndReviews;