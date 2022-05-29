import {useCallback, useEffect, useState} from "react";

export function useInfinityScrollObserver(ref) {

    let [isVisible, setIsVisible] = useState(false);

    const handleIntersection = useCallback(([entry]) => {
        if (entry.isIntersecting){
            setIsVisible(true)
        }else if (!entry.isIntersecting){
            setIsVisible(false)
        }

    }, [])


    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0
        }

        // Create the observer, passing in the callback
        const observer = new IntersectionObserver(handleIntersection, options);

        // If we have a ref value, start observing it
        if (ref.current) {
            observer.observe(ref.current);
        }

        // If unmounting, disconnect the observer
        return () => {
            observer.unobserve(ref.current)
            observer.disconnect();
        }

    }, [handleIntersection]);

    return isVisible;
}