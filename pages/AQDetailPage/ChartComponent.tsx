import { SvgChart, SVGRenderer } from '@wuba/react-native-echarts';
import * as echarts from 'echarts/core';
import { useRef, useEffect } from 'react';
import {
    BarChart,
    LineChart,
} from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
} from 'echarts/components';

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    SVGRenderer,
    LineChart,
    // ...
    BarChart,
])

const E_HEIGHT = 250;
const E_WIDTH = 300;

export function ChartComponent({ option }: any) {
    const chartRef = useRef<any>(null);

    useEffect(() => {
        let chart: any;
        if (chartRef.current) {
            // @ts-ignore
            chart = echarts.init(chartRef.current, 'light', {
                renderer: 'svg',
                width: E_WIDTH,
                height: E_HEIGHT,
            });
            chart.setOption(option);
        }
        return () => chart?.dispose();
    }, [option]);

    return <SvgChart ref={chartRef} />;
}