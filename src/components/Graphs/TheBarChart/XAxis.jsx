const XAxis = ({step, widthOfBar, data, xPosition}) => {

    return(
        <g className={"x-axis"} fontSize={"10"} transform={`translate(0, ${xPosition})`} fill={'none'} textAnchor={'middle'}>
            {data.map((d, i) => ( i % 3 === 0 &&
                <g className={'tick'} key={d.date}  transform={`translate(${i === 0 ? widthOfBar / 2 : widthOfBar / 2 + i * step}, 0)`}>
                    <text fill={"currentColor"} y={"9"} dy={"0.71em"}>{d.date}</text>
                </g>
            ))}
        </g>
    )
}

export default XAxis;