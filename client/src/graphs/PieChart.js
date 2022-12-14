import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/plots';

const PieChart = () => {
  const data = [
    {
      type: 'Mon',
      value: 100,
    },
    {
      type: 'Tue',
      value: 60,
    },
    {
      type: 'Wed',
      value: 80,
    },
    {
      type: 'Thur',
      value: 100,
    },
    {
      type: 'Fri',
      value: 81,
    },
    {
      type: 'Sat',
      value: 82,
    },
  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1.0,
    label: {
      type: 'inner',
      offset: '-30%',
      // content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      content: ({ percent }) => {
        const val = (percent * 100).toFixed(0)

        console.log(val);

        if (val >= 50) {
          return "Present"
        } else {
          return "Absent"
        }
      },
      style: {
        fontSize: 10,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    height: 150,
    width: 400
  };
  return <Pie {...config} />;
};

export default PieChart