import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";

import { cn } from "./utils";

// export const useCarousel = () => {
//     const [ emblaRef, emblaApi ] = useEmblaCarousel();
//     const [ canScrollNext, setCanScrollNext ] = React.useState<boolean>(emblaApi?.canScrollNext() ?? false);
//     const [ canScrollPrev, setCanScrollPrev ] = React.useState<boolean>(emblaApi?.canScrollPrev() ?? false);

//     const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
//         setCanScrollNext(emblaApi.canScrollNext());
//         setCanScrollPrev(emblaApi.canScrollPrev());
//     }, []);
    
//     React.useEffect(() => {
//         if (!emblaApi) return;
        
//         onSelect(emblaApi);
//         emblaApi.on("reInit", onSelect).on("select", onSelect);
//     }, [ emblaApi, onSelect ])

//     return [ emblaRef, emblaApi, { canScrollNext, canScrollPrev } ] as const;
// };

type Image =  {
    id: string;
    url: string;
};

type CarouselProps = {
    images: Image[];
    thumbPadding?: `p-${number}`;
};

const Carousel: React.FC<CarouselProps> = ({ images, thumbPadding = "p-2" }) => {
    const [ selectedIndex, setSelectedIndex ] = React.useState<number>(0);
    const [ mainEmblaRef, mainEmblaApi ] = useEmblaCarousel();
    const [ thumbsEmblaRef, thumbsEmblaApi ] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true
    });

    const onThumbClick = React.useCallback((index: number) => (event: React.MouseEvent<HTMLDivElement>) => {
        if (!mainEmblaApi || !thumbsEmblaApi) return;
        
        mainEmblaApi.scrollTo(index);
    }, [ mainEmblaApi, thumbsEmblaApi ]);

    const onSelect = React.useCallback(() => {
        if (!mainEmblaApi || !thumbsEmblaApi) return;

        setSelectedIndex(mainEmblaApi.selectedScrollSnap());

        thumbsEmblaApi.scrollTo(mainEmblaApi.selectedScrollSnap());
    }, [ mainEmblaApi, thumbsEmblaApi, setSelectedIndex ]);

    React.useEffect(() => {
        if (!mainEmblaApi) return;
        
        onSelect();

        mainEmblaApi.on("select", onSelect).on("reInit", onSelect);
    }, [ mainEmblaApi, onSelect ]);

    return (
        <div className="space-y-2">
            <div className="overflow-hidden" ref={mainEmblaRef}>
                <div className="flex">
                    { images.map(image => (
                        <div key={image.id} className="mr-1 last:mr-0 bg-gray-100 flex-[0_0_100%] overflow-hidden lg:rounded-lg">
                            <img src={image.url} />
                        </div>
                    )) }
                </div>
            </div>
            <div
                ref={thumbsEmblaRef}
                className={
                    cn(
                        "overflow-hidden",
                        thumbPadding,
                    )
                }
            >
                <div className="flex items-center gap-3">
                    { images.map((image, index) => (
                        <div
                            key={image.id}
                            className={
                                cn(
                                    "mr--2 last:mr-0 flex-[0_0_17.5%] aspect-square opacity-20 rounded-lg overflow-hidden cursor-pointer transition",
                                    { "opacity-100 ring-2 ring-offset-2 ring-indigo-600": selectedIndex === index }
                                )
                            }
                            onClick={onThumbClick(index)}
                        >
                            <img src={image.url} />
                        </div>
                    )) }
                </div>
            </div>
        </div>
    );
};

export default Carousel;