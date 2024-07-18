import React from "react";

import { cn } from "../utils";

import Image from "./Image";

type Image =  {
    id: string;
    url: string;
};

type ItemProps = {
    image: Image;
};

const Item: React.FC<ItemProps> = ({ image }) => {
    return (
        <div className="flex-none w-full snap-start">
            <Image key={image.id} src={image.url} className="rounded-none" />
        </div>
    );
};

type CarouselProps = {
    images: Image[];
    imageId?: string | null;
};

const Carousel: React.FC<CarouselProps> = ({ images, imageId }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [ currentIndex, setCurrentIndex ] = React.useState<number>(0);

    const handleOnScrollLeft = () => {
        ref.current && ref.current?.scrollTo({ left: (currentIndex - 1) * (ref.current.scrollWidth / images.length), behavior: "smooth" });
    };

    const handleOnScrollRight = () => {
        ref.current && ref.current?.scrollTo({ left: (currentIndex + 1) * (ref.current.scrollWidth / images.length), behavior: "smooth" });
    };

    const handleOnScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
        setCurrentIndex(Math.round(event.currentTarget.scrollLeft / (event.currentTarget.scrollWidth / images.length)));
    };

    React.useEffect(() => {
        const imageIndex = images.findIndex(image => image.id === imageId);

        (imageIndex >= 0) ?
            ref.current && ref.current?.scrollTo({ left: (imageIndex) * (ref.current.scrollWidth / images.length), behavior: "smooth" }) :
            ref.current && ref.current?.scrollTo({ left: (-1) * (ref.current.scrollWidth / images.length), behavior: "smooth" });
    }, [ imageId ]);

    return (
        <div className="relative w-full aspect-square bg-gray-100 animate-pulse lg:rounded-lg">
            <div ref={ref} className="flex flex-nowrap overflow-x-scroll snap-x snap-mandatory no-scrollbar" onScroll={handleOnScroll}>
                { images.map(image => (
                    <Item key={image.id} image={image} />
                )) }
            </div>
            { images.length > 1 && (
                <div className="absolute bottom-0 inset-x-0 py-3 flex items-center justify-center">
                    <div className="p-1.5 px-2 bg-black bg-opacity-50 flex items-center justify-center gap-2.5 border-1 border-gray-50 rounded-xl">
                        { images.map((image, index) => (
                            <div
                                key={image.id}
                                className={
                                    cn(
                                        "w-2 h-2 bg-gray-400 rounded-full transition",
                                        { "bg-white ring-1 ring-white": index === currentIndex }
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

export default Carousel;