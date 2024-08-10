import React from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { AiTwotoneSafetyCertificate } from "react-icons/ai";
import { cn } from "~/components/utils";

type GuranteedProps = {
    className?: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
};

const Guranteed: React.FC<GuranteedProps> = ({ className, icon, title, subtitle }) => {
    return (
        <div
            className={
                cn(
                    "p-4 xl:p-8 flex flex-col items-center gap-1.5",
                    className
                )
            }
        >
            { icon }
            <div className="flex flex-col items-center xl:space-y-1.5">
                <div className="text-lg lg:text-base text-center font-bold tracking-tight">{ title }</div>
                <div className="text-sm lg:text-xs text-center text-gray-400">{ subtitle }</div>
            </div>
        </div>
    );
};

export default Guranteed;