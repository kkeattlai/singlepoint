import React from "react";
import { useLoaderData, useNavigate } from "@remix-run/react"
import { type LoaderFunctionArgs } from "@remix-run/node";
import { DateTime } from "luxon";
import Button from "~/components/Button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    return {};
};

const useTimer = (startTime: number, endTime: number | undefined = 0) => {
    const timerEnd = DateTime.now().plus({ seconds: startTime }).toSeconds();
    const [ timer, setTimer ] = React.useState<number>(Math.round(timerEnd - DateTime.now().toSeconds()));

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer => {
                if (timer <= endTime) {
                    clearInterval(interval);

                    return endTime;
                }

                return Math.round(timerEnd - DateTime.now().toSeconds());
            });
        }, 1000);
    }, []);

    return timer;
};

type PageProps = {
    
};

const Page: React.FC<PageProps> = () => {
    const timer = useTimer(3);
    const navigate = useNavigate();

    React.useEffect(() => {
        timer <= 0 && navigate("/dashboard");
    }, [ timer ]);
    
    return (
        <Button>Redirecting in { timer }</Button>
    );
};

export default Page;