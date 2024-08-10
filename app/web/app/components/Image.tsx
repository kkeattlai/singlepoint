import React from "react";

import { cn } from "./utils";

type ImageProps = {
    src?: string | null;
} & React.HTMLAttributes<HTMLDivElement>;

const Image: React.FC<ImageProps> = ({ className, src, ...props }) => {
    const [ imageSrc, setImageSrc ] = React.useState<string | undefined>(undefined);
    const [ isError, setIsError ] = React.useState<boolean>(false);
    const [ isLoading, setIsLoading ] = React.useState<boolean>(true);

    const handleOnLoadStart = () => {
        setIsLoading(true);
    };

    const handleOnLoad = () => {
        setIsLoading(false);
    };

    const handleOnError = () => {
        setIsError(true);
        setIsLoading(false);
    };

    React.useEffect(() => {
        setTimeout(() => {
            src !== null && setImageSrc(src);
        }, 0);
    }, []);

    return (
        <div
            className={
                cn(
                    "w-full rounded-lg overflow-hidden",
                    { "aspect-square bg-gray-200 animate-pulse": isLoading },
                    { "aspect-square bg-gray-200": isError },
                    { "aspect-square": !src },
                    className
                )
            }
            { ...props }
        >
            { !isError && src && (
                <img className="w-full h-full object-cover" src={imageSrc} onLoadStart={handleOnLoadStart} onLoad={handleOnLoad} onError={handleOnError} />
            ) }
            { isError && (
                <div className="w-full h-full flex items-center justify-center text-xs text-center">Something went wrong</div>
            ) }
        </div>
    );
};

export default Image;