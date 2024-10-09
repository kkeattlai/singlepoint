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
    columns?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12";
} & React.PropsWithChildren;

const FlatList: React.FC<FlatListProps> = ({ className, mode = "light", columns = "1", ...props }) => {
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

    // console.log(ref.current?.clientWidth);
    // console.log(ref.current?.offsetWidth);
    // console.log(ref.current?.getBoundingClientRect())

    // console.log(typeof window);

    React.useEffect(() => {
        
        if (typeof window === "object") {
            console.log(ref.current?.getBoundingClientRect());
        }
    }, [ typeof window ]);

    return (
        <div
            className={
                cn(
                    "relative w-full pb-10",
                    // className
                )
            }
        >
            <div
                ref={ref}
                className={
                    cn(
                        "flex flex-row overflow-x-scroll snap-x snap-mandatory no-scrollbar col-span-3",
                        { "grid-cols-1": columns === "1" },
                        { "grid-cols-2": columns === "2" },
                        { "grid-cols-3": columns === "3" },
                        { "grid-cols-4": columns === "4" },
                        { "grid-cols-5": columns === "5" },
                        { "grid-cols-6": columns === "6" },
                        { "grid-cols-7": columns === "7" },
                        { "grid-cols-8": columns === "8" },
                        { "grid-cols-9": columns === "9" },
                        { "grid-cols-10": columns === "10" },
                        { "grid-cols-11": columns === "11" },
                        { "grid-cols-12": columns === "12" },
                        className
                    )
                }
                onScroll={handleOnScroll}
            >
                { React.Children.map(props.children, (child, index) => (
                    <Item key={index}>
                        { child }
                    </Item>
                )) }
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