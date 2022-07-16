import {useEffect, useRef, useState} from "react";

export default function useResizeObserver(elRef, breakpoints) {
    const [breakSize, setBreakSize] = useState()

    const observer = useRef(
        new ResizeObserver(entries => {
            // Only care about the first element, we expect one element ot be watched
            const { width } = entries[0].contentRect
            const breakPoint = findBreakPoint(breakpoints, width)
            setBreakSize(breakPoint)
        })
    )

    useEffect(() => {
        let element;
        if (elRef.current) {
            element = elRef.current;
            observer.current.observe(element)
        }
        return () => {
            observer.current.unobserve(element)
            observer.current.disconnect()
        }
    }, [elRef.current, observer])

    return breakSize
}

function findBreakPoint(breakpoints, width) {
    const breakpointIndex = breakpoints
        .map(x => Object.values(x)[0])
        .findIndex(x => width < Math.round(x));

    // element is larger than every breakpoint so it must be the last breakpoint
    if (breakpointIndex === -1) {
        return null;
    }

    return Object.keys(breakpoints[breakpointIndex])[0];
}