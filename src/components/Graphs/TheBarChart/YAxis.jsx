import {formatter} from "../../../helpers/utils";

const YAxis = ({ticks, yPosition,}) => {

    return (
        <g className={"y-axis"}   fontSize={"10"} textAnchor={'start'} transform={`translate(${yPosition}, 0)`}>
            {ticks.map(({value, offSet}, i) => i % 3 === 0 &&
                <g className={'tick'} key={value} transform={`translate(0, ${offSet})`}>
                    <text fill={"currentColor"} dominantBaseline={"middle"}>
                        {formatter.format(value)}
                    </text>
                </g>
            )}
        </g>
    )
}

export default YAxis;