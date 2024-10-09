import { DateTime } from "luxon";
import React from "react";
import { TbStar, TbStarFilled, TbThumbDown, TbThumbUp } from "react-icons/tb";
import Button from "~/components/Button";
import SelectField from "~/components/SelectField";
import Analytics from "./Analytics";

type ReviewsProps = {
    
};

const Reviews: React.FC<ReviewsProps> = () => {
    return (
        <div className="flex lg:flex-row flex-col-reverse gap-10">
            <div className="flex-1 space-y-8">
                <SelectField
                    data={[
                        { label: "Newest", value: "Newest" },
                        { label: "High to low", value: "High to low" },
                        { label: "Low to high", value: "Low to high" }
                    ]}
                    selectedKey="Newest"
                />
                { [
                    { id: 1, avatar: "", name: "Helen M.", rating: 2.5, comments: "Excellent phone to use. It is smooth as the first iOS ever.", likes: 23, dislike: 2, createdAt: DateTime.now().minus({ days: 1 }).toRelative() },
                    { id: 2, avatar: "", name: "John Doe", rating: 5, comments: "As usual phones are big, phone battery is lasting and camera is clear as ever", likes: 623, dislike: 0, createdAt: DateTime.now().minus({ days: 5 }).toRelative() }
                ].map(review => (
                    <div key={review.id} className="flex gap-3">
                        <div className="flex-none w-10">
                            <div className="w-full aspect-square bg-gray-100 rounded-full" />
                        </div>
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-3">
                                <div className="text-sm font-semibold tracking-tight">{ review.name }</div>
                                <div className="text-xs text-gray-400">{ review.createdAt }</div>
                            </div>
                            <div className="flex gap-0">
                                { new Array(5).fill("").map((rating, index) => (
                                    review.rating < index ? (
                                        <div className="text-sm text-gray-300 font-semibold tracking-tight">
                                            <TbStarFilled />
                                        </div>
                                    ): (
                                        <div className="text-sm text-amber-400 font-semibold tracking-tight">
                                            <TbStarFilled />
                                        </div>
                                    )
                                )) }
                            </div>
                            <div className="py-4 text-sm text-gray-700">{ review.comments }</div>
                            <div className="flex items-center gap-3.5">
                                <Button variant="link" color="transparent" className="text-xs">Reply</Button>
                                <Button variant="link" color="transparent" className="text-xs" leadingIcon={<TbThumbUp />}>{ review.likes }</Button>
                                <Button variant="link" color="transparent" className="text-xs" leadingIcon={<TbThumbDown />}>{ review.dislike }</Button>
                            </div>
                        </div>
                    </div>
                )) }
            </div>
            <Analytics />
        </div>
    );
};

export default Reviews;