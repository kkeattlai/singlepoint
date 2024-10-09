import React from "react";

import { cn } from "./utils";

type ItemProps = {

} & React.PropsWithChildren;

const Item: React.FC<ItemProps> = ({ ...props }) => {
    return (
        <div className="flex justify-center flex-none w-full snap-start">
            { props.children }
        </div>
    );
};

type FlatListProps = {
    className?: string;
    mode?: "light" | "dark";
    groupBy?: "sm" | "md" | "lg" | "xl";
} & React.PropsWithChildren;

const FlatList: React.FC<FlatListProps> = ({ className, mode = "light", groupBy = "sm", ...props }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const childrenCount = React.Children.count(props.children);
    const [ currentIndex, setCurrentIndex ] = React.useState<number>(0);

    const handleOnScrollLeft = () => {
        ref.current && ref.current?.scrollTo({ left: (currentIndex - 1) * (ref.current.scrollWidth / childrenCount), behavior: "smooth" });
    };

    const handleOnScrollRight = () => {
        ref.current && ref.current?.scrollTo({ left: (currentIndex + 1) * (ref.current.scrollWidth / childrenCount), behavior: "smooth" });
    };

    const handleOnScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
        setCurrentIndex(Math.round(event.currentTarget.scrollLeft / (event.currentTarget.scrollWidth / childrenCount)));
    };

    // React.useEffect(() => {
    //     const imageIndex = images.findIndex(image => image.id === imageId);

    //     (imageIndex >= 0) ?
    //         ref.current && ref.current?.scrollTo({ left: (imageIndex) * (ref.current.scrollWidth / images.length), behavior: "smooth" }) :
    //         ref.current && ref.current?.scrollTo({ left: (-1) * (ref.current.scrollWidth / images.length), behavior: "smooth" });
    // }, [ imageId ]);

     // Group children in pairs
    // const groupedChildren: React.ReactNode[] = [];
    
    // React.Children.forEach(props.children, (child, index) => {
    //     if (index % groupBy === 0) {
    //         groupedChildren.push([child]);
    //     } else {
    //         groupedChildren[groupedChildren.length - 1].push(child);
    //     }
    // });

    // console.log(groupedChildren);

    // console.log(groupedChildren.map(child => {
    //     console.log(`<div>child</div>`)
    // }));

    return (
        <div
            className={
                cn(
                    "relative w-full pb-10",
                    className
                )
            }
        >
            <div
                ref={ref}
                className={
                    cn(
                        "grid grid-cols-1 overflow-x-scroll snap-x snap-mandatory no-scrollbar",
                        // { "grid-cols-1": groupBy === "sm" },
                        { "grid-cols-2": groupBy === "md" },
                        { "grid-cols-3": groupBy === "lg" },
                        { "grid-cols-4": groupBy === "xl" },
                    )
                }
                onScroll={handleOnScroll}
            >
                { React.Children.map(props.children, (child, index) => (
                    <Item key={index}>
                        { child }
                    </Item>
                )) }
                {/* { groupedChildren.map((child, index) => (
                    <Item key={index}>
                        { child }
                    </Item>
                )) } */}
            </div>
            { props.children && React.Children.count(props.children) > 1 && (
                <div className="absolute bottom-0 inset-x-0 py-3 flex items-center justify-center">
                    <div
                        className={
                            cn(
                                "p-1.5 px-2 bg-opacity-50 flex items-center justify-center gap-2.5 border-1 border-gray-50 rounded-xl",
                                { "bg-black": mode === "dark" },
                            )
                        }
                    >
                        { React.Children.map(props.children, (child, index) => (
                            <div
                                key={index}
                                className={
                                    cn(
                                        "w-2 h-2 rounded-full transition",
                                        { "bg-gray-300": mode === "light" },
                                        { "bg-gray-400": mode === "dark" },
                                        { "bg-gray-700 ring-1 ring-gray-700": mode === "light" && index === currentIndex },
                                        { "bg-white ring-1 ring-white": mode === "dark" && index === currentIndex }
                                    )
                                }
                            />
                        )) }
                    </div>
                </div>
            ) }
            <div className="absolute left-0 w-10 inset-y-0" onClick={handleOnScrollLeft} />
            <div className="absolute right-0 w-10 inset-y-0" onClick={handleOnScrollRight} />
        </div>
    );
};

export default FlatList;