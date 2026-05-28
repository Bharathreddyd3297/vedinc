import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 80) {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayed((prev) => prev + text[index]);
            index++;

            if (index >= text.length) {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return displayed;
}
