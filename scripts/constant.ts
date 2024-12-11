export enum EPollution {
    pm10 = 1,
    pm25,
    o3,
    co,
    no2,
    so2,
}

const POLLUTION_MAP: Record<EPollution, string> = {
    [EPollution.pm10]: "PM10",
    [EPollution.pm25]: "PM2.5",
    [EPollution.o3]: "O3",
    [EPollution.co]: "CO",
    [EPollution.no2]: "NO2",
    [EPollution.so2]: "SO2",
};


export const LEVEL_COLORS = [
    "#35C77E", // Good
    "#A0C334", // Fair
    "#FFD700", // Moderate
    "#FF8C00", // Poor
    "#FF4500", // Very Poor
    "#8B0000", // Extremely Poor
];

// AQI分级区间
export const AQI_BREAKPOINTS: { [key: string]: { low: number; high: number; aqiLow: number; aqiHigh: number; }[] } = {
    [EPollution.pm10]: [
        { low: 0, high: 50, aqiLow: 0, aqiHigh: 50 },
        { low: 50, high: 100, aqiLow: 51, aqiHigh: 100 },
        { low: 100, high: 250, aqiLow: 101, aqiHigh: 150 },
        { low: 250, high: 350, aqiLow: 151, aqiHigh: 200 },
        { low: 350, high: 420, aqiLow: 201, aqiHigh: 300 },
        { low: 420, high: 1000, aqiLow: 301, aqiHigh: 500 },
    ],
    [EPollution.pm25]: [
        { low: 0, high: 10, aqiLow: 0, aqiHigh: 20 },
        { low: 10, high: 20, aqiLow: 21, aqiHigh: 40 },
        { low: 20, high: 25, aqiLow: 41, aqiHigh: 60 },
        { low: 25, high: 50, aqiLow: 61, aqiHigh: 80 },
        { low: 50, high: 75, aqiLow: 81, aqiHigh: 100 },
        { low: 75, high: 800, aqiLow: 101, aqiHigh: 500 },
    ],
    [EPollution.o3]: [
        { low: 0, high: 50, aqiLow: 0, aqiHigh: 50 },
        { low: 50, high: 100, aqiLow: 51, aqiHigh: 100 },
        { low: 100, high: 180, aqiLow: 101, aqiHigh: 150 },
        { low: 180, high: 240, aqiLow: 151, aqiHigh: 200 },
        { low: 240, high: 300, aqiLow: 201, aqiHigh: 300 },
        { low: 300, high: 500, aqiLow: 301, aqiHigh: 500 },
    ],
    [EPollution.co]: [
        { low: 0, high: 2, aqiLow: 0, aqiHigh: 50 },
        { low: 2, high: 5, aqiLow: 51, aqiHigh: 100 },
        { low: 5, high: 10, aqiLow: 101, aqiHigh: 150 },
        { low: 10, high: 15, aqiLow: 151, aqiHigh: 200 },
        { low: 15, high: 30, aqiLow: 201, aqiHigh: 300 },
        { low: 30, high: 50, aqiLow: 301, aqiHigh: 500 },
    ],
    [EPollution.no2]: [
        { low: 0, high: 40, aqiLow: 0, aqiHigh: 50 },
        { low: 40, high: 80, aqiLow: 51, aqiHigh: 100 },
        { low: 80, high: 180, aqiLow: 101, aqiHigh: 150 },
        { low: 180, high: 280, aqiLow: 151, aqiHigh: 200 },
        { low: 280, high: 400, aqiLow: 201, aqiHigh: 300 },
        { low: 400, high: 1000, aqiLow: 301, aqiHigh: 500 },
    ],
    [EPollution.so2]: [
        { low: 0, high: 40, aqiLow: 0, aqiHigh: 50 },
        { low: 40, high: 100, aqiLow: 51, aqiHigh: 100 },
        { low: 100, high: 200, aqiLow: 101, aqiHigh: 150 },
        { low: 200, high: 400, aqiLow: 151, aqiHigh: 200 },
        { low: 400, high: 800, aqiLow: 201, aqiHigh: 300 },
        { low: 800, high: 1000, aqiLow: 301, aqiHigh: 500 },
    ],
};
