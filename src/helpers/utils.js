import {complement, curry, empty, ifElse, isEmpty, isNil, not, when} from "ramda";
import {IO} from "monio";

export const notEqual = curry((firstVal, secondVal) => {
    return firstVal !== secondVal;
})

export const whenIs = curry((data, predicate, onTrue) =>  when(predicate, onTrue, data))

export const isNotNil = val => not(isNil(val))

export const isEmptyString = val => val === ''

export const notNil = isNotNil;

export const notEmpty = arr => complement(isEmpty(arr))


export const notEmptyString = val => val !== ''

export const formatter = Intl.NumberFormat('en', {notation: 'compact'});

export const debounce = (cb, delay = 1000) => {
    let timeout;

    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)

        return timeout;
    }
}


export const removeClassIO = curry((className, element) =>
    IO(() => {
        element.classList.remove(className)
        return element;
    })
)


export const addClassIO = curry( (className, element) =>
    IO( () => {
        element.classList.add(className)
        return element;
    })
)

export const addStyleIO = curry(([prop, val], element) =>
    IO(() => {
        element.style[prop] = val;
        return element
    })
)

export const addAttributeIO = (([prop, val], element) =>
    IO(() => {
        element.setAttribute(prop, val)
    })
)

export const removeAttributeIO = ((prop, element) =>
        IO(() => {
            element.removeAttribute(prop)
        })
)

export const addTextContentIO = (text, element) =>
    IO(() => {
        element.textContent = text;
    })

export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}