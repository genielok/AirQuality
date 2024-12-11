import { Sensor } from "./api";
import { AQI_BREAKPOINTS, EPollution, LEVEL_COLORS } from "./constant";




// 根据浓度计算单一污染物的AQI
function calculateAQI(concentration: number, pollutant: EPollution) {
    const breakpoints = AQI_BREAKPOINTS[pollutant]
    if (!breakpoints) {
        throw new Error(`未知污染物: ${pollutant}`);
    }

    for (let i = 0; i < breakpoints.length; i++) {
        const { low, high, aqiLow, aqiHigh } = breakpoints[i];
        if (concentration >= low && concentration <= high) {
            // 线性映射公式
            return ((aqiHigh - aqiLow) / (high - low)) * (concentration - low) + aqiLow;
        }
    }

    // 超出范围
    return null;
}



export function calculateOverallAQI(sensors: Sensor[]) {
    const data = sensors.map(item => {
        return {
            id: item.parameter.id,
            value: item.latest.value
        }
    })
    let maxAQI = 0;

    data.forEach(item => {
        const aqi = calculateAQI(item.value, item.id);
        if (aqi !== null && aqi > maxAQI) {
            maxAQI = aqi; // 综合AQI取最大值
        }
    });
    const result = maxAQI.toFixed(0)
    return Number(result);
}


export function calculateProgressBar(pollutant: EPollution, value: number): { progress: number, color: string } {
    const ranges = AQI_BREAKPOINTS[pollutant];
    for (let i = 0; i < ranges.length; i++) {
        if (value >= ranges[i].low && value <= ranges[i].high) {
            const progress = ((value - ranges[i].low) / (ranges[i].high - ranges[i].low))
            return {
                progress: Math.min(100, Math.max(0, progress)),
                color: LEVEL_COLORS[i]
            }
        }
    }
    // 如果不在任何范围内，返回 0% 或 100%
    return { progress: value < ranges[0].low ? 0 : 100, color: '#000000' }
}

