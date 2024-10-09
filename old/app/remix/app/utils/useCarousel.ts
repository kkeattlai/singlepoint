import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";

export const useCarousel = () => {
    const [ emblaRef, emblaApi ] = useEmblaCarousel();
    const [ canScrollNext, setCanScrollNext ] = React.useState<boolean>(emblaApi?.canScrollNext() ?? false);
    const [ canScrollPrev, setCanScrollPrev ] = React.useState<boolean>(emblaApi?.canScrollPrev() ?? false);

    const onSelect = React.useCallback((emblaApi: EmblaCarouselType) => {
        setCanScrollNext(emblaApi.canScrollNext());
        setCanScrollPrev(emblaApi.canScrollPrev());
    }, []);
    
    React.useEffect(() => {
        if (!emblaApi) return;
        
        onSelect(emblaApi);
        emblaApi.on("reInit", onSelect).on("select", onSelect);
    }, [ emblaApi, onSelect ])

    return [ emblaRef, emblaApi, { canScrollNext, canScrollPrev } ] as const;
};