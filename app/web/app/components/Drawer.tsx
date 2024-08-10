import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ClientOnly } from "remix-utils/client-only";
import { cn } from "./utils";

type DrawerProps = {
    anchor?: "left" | "right";
    isOpen?: boolean;
    setIsOpen?: (isOpen: React.SetStateAction<boolean>) => void;
} & React.PropsWithChildren;

const Drawer: React.FC<DrawerProps> = ({ anchor = "left", isOpen = false, setIsOpen, ...props }) => {
    const handleOnToggleDrawer = () => {
		setIsOpen && setIsOpen(isOpen => !isOpen);
	};

    return (
        <AnimatePresence>
            { isOpen && (
                <ClientOnly>
                    { () => (
                        createPortal(
                            <div className="fixed inset-0 z-10">
                                <motion.div
                                    className="absolute inset-0 bg-black bg-opacity-15 -z-10" onClick={handleOnToggleDrawer}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                                <motion.div
                                    className={
                                        cn(
                                            "absolute inset-y-0 w-[90%] bg-white",
                                            { "left-0": anchor === "left" },
                                            { "right-0": anchor === "right" }
                                        )
                                    }
                                    initial={{ x: anchor === "left" ? -12 : 12, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: anchor === "left" ? -12 : 12, opacity: 0 }}
                                    transition={{ ease: "linear" }}
                                >
                                    <div className="h-full flex items-stretch">
                                        { props.children }
                                    </div>
                                </motion.div>
                            </div>
                        , document.body)
                    ) }
                </ClientOnly>
            ) }
        </AnimatePresence>
    );
};

export default Drawer;