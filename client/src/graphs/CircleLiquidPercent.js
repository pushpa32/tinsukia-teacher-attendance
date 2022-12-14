import React from 'react'
import { Liquid } from '@ant-design/plots';


const CircleLiquidPercent = (data) => {
    const config = {
        percent: data.data,
        outline: {
            border: 4,
            distance: 8,
        },
        wave: {
            length: 128,
        },
        height: 150,
        width: 150,
    };
    // style={{width: "200px", height: "200px"}}
    return <Liquid {...config} />;
}

export default CircleLiquidPercent