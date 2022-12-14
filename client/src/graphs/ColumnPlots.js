import React from 'react'
import { Column } from '@ant-design/plots';

const ColumnPlots = () => {
  const data = [
    {
      type: 'Mond',
      value: 10,
    },
    {
      type: 'Tue',
      value: 20,
    },
    {
      type: 'Wed',
      value: 30,
    },
    {
      type: 'Thur',
      value: 40,
    },
    {
      type: 'Fri',
      value: 60,
    },
    {
      type: 'Sat',
      value: 100,
    },
  ];
  const paletteSemanticRed = '#F4664A';
  const brandColor = '#5B8FF9';
  const config = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: '',
    color: ({ type }) => {
      if (type === '10-30' || type === '30+') {
        return paletteSemanticRed;
      }

      return brandColor;
    },
    label: {
      content: (originData) => {
        const val = parseFloat(originData.value);

        if (val < 0.05) {
          return (val * 100).toFixed(1) + '%';
        }
      },
      offset: 10,
    },
    legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    theme: 'default', // 'dark',
    height: 150,
    width: 400
  };
  return <Column {...config} />;
}

export default ColumnPlots