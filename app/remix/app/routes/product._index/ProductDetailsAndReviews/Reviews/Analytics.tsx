import React from "react";
import { TbStarFilled } from "react-icons/tb";
import { cn } from "~/components/utils";

type ReviewBarRatedByBuyerProps = {
    star: number;
    user: number;
    totalUser: number;
};

const ReviewBarRatedByBuyer: React.FC<ReviewBarRatedByBuyerProps> = ({ star, user = 0, totalUser = 0 }) => {
    const progress = user / totalUser;

    console.log(progress * 100);

    return (
        <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">{ star }</div>
            <div className="relative h-4 flex-1 rounded overflow-hidden">
                <div className="absolute inset-0 bg-gray-100" />
                <div
                    className={
                        cn(
                            `absolute w-0 inset-y-0 bg-amber-300 rounded`
                        )
                    }
                    style={{
                        width: `${progress * 100}%`
                    }}
                />
            </div>
            <div className="w-6 text-right text-sm text-gray-400">{ user }</div>
        </div>
    );
};

type AnalyticsProps = {
    
};

const Analytics: React.FC<AnalyticsProps> = () => {
    return (
        <div className="w-full lg:w-[350px] space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 gap-0">
                    { new Array(5).fill("").map((rating, index) => (
                        rating < index ? (
                            <div className="text-lg text-gray-300 font-semibold tracking-tight">
                                <TbStarFilled />
                            </div>
                        ): (
                            <div className="text-lg text-amber-400 font-semibold tracking-tight">
                                <TbStarFilled />
                            </div>
                        )
                    )) }
                </div>
                <div className="text-xl font-semibold ">4.8</div>
            </div>
            <div className="space-y-2">
                <ReviewBarRatedByBuyer star={5} user={54} totalUser={71} />
                <ReviewBarRatedByBuyer star={4} user={9} totalUser={71} />
                <ReviewBarRatedByBuyer star={3} user={6} totalUser={71} />
                <ReviewBarRatedByBuyer star={2} user={2} totalUser={71} />
                <ReviewBarRatedByBuyer star={1} user={0} totalUser={71} />
            </div>
        </div>
    );
};

export default Analytics;