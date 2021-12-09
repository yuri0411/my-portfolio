import { isEmpty } from 'lodash';

export const SELECTED_TAG_STYLE = (color) => {
    return {
        width: '100%',
        border: `1.5px solid ${color}`,
        borderLeft: `8px solid ${color}`,
        backgroundColor: '#fff',
        color: color,
    };
};

export const TAG_STYLE = (color) => {
    return {
        borderWidth: 1.5,
        borderColor: color,
        backgroundColor: color,
        color: '#fff',
    };
};

export const getColorPalette = () => {
    const palette = [
        ['#ffa39e', '#ff7875', '#ff4d4f', '#f5222d', '#cf1322', '#a8071a'],
        ['#ffbb96', '#ff9c6e', '#ff7a45', '#fa541c', '#d4380d', '#ad2102'],
        ['#ffe38a', '#fad061', '#fac13b', '#faad14', '#d48806', '#ad6800'],
        ['#b7eb8f', '#73d13d', '#389e0d', '#237804', '#135200', '#092b00'],
    ];

    let newPalette = [];
    for (let i = 0; i < palette[0].length; i++) {
        for (let j = 0; j < palette.length; j++) {
            newPalette.push(palette[j][i]);
        }
    }
    return newPalette;
};

export const pieData = () => {
    let dataArr = [];
    for (let i = 0; i < 24; i++) {
        dataArr.push({
            name: i.toString(),
            value: 100 / 23,
        });
    }
    return dataArr;
};

export const getInitColorArr = (dimSettingData) => {
    const initColorArr = new Array(24).fill('#ccc');
    if (!isEmpty(dimSettingData)) {
        dimSettingData?.forEach((tagData) => {
            tagData.time.forEach((timeIdx) => {
                initColorArr[timeIdx] = tagData.color;
            });
        });
    }

    return initColorArr;
};

export const getDimChartOption = (colorArr) => {
    let series = [];
    series.push({
        type: 'pie',
        radius: ['20%', '78%'],
        center: ['50%', '50%'],
        startAngle: 90,
        z: 10,
        itemStyle: {
            normal: {
                borderWidth: 2,
                borderColor: 'white',
            },
        },
        label: {
            show: false,
        },
        data: pieData(),
        labelLine: {
            show: false,
        },
        color: colorArr,
    });
    return {
        backgroundColor: 'transparent',
        tooltip: {
            show: false,
        },
        angleAxis: {
            data: pieData().map((d) => {
                return d.name;
            }),
            boundaryGap: false,
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
        },
        radiusAxis: {
            axisLine: {
                show: false,
            },
        },
        polar: {},
        series: series,
        animation: false,
    };
};
