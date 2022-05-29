import {useEffect, useState} from "react";
import {IO, Either} from 'monio'

const useIO = ({sideEffectFunction, args = []}, dependencies = []) => {

    const [data, setData] = useState(null)

    function* main() {
        try {
            const returnVal = yield sideEffectFunction(...args)
            setData(Either.Right(returnVal))
        }catch (err){
            setData(Either.Left(err))
        }
    }

    useEffect(() => {
        IO.do(main).run()
    }, dependencies)


    return data

}

export default useIO;