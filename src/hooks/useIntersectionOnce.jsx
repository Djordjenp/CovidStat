import {useEffect, useRef, useState} from "react";

export function useIntersectionOnce(ref, options) {
    const [isVisible, setIsVisible] = useState(false);

    const observerRef = useRef(new IntersectionObserver(([entry], observer) => {
        if (entry.isIntersecting){
            setIsVisible(true)
            observer.unobserve(ref.current)
            observer.disconnect();
        }
    }, options));

    useEffect(() => {
        // If we have a ref value, start observing it
        if (ref.current) {
            observerRef.current.observe(ref.current);
        }

        // If unmounting, disconnect the observer
        return () => {
            if (ref.current){
                observerRef.current.unobserve(ref.current)
                observerRef.current.disconnect();
            }
        }
    }, [ref.current]);

    return isVisible;
}