import moment from 'moment'
import { EPollution } from './constant'
import Fetch from './fetch'
interface TBaseParams {
    limit: number,
    page: number
}
interface BaseRes<T> {
    meta: any,
    results: T[]
}
interface Pollution {
    id: number,
    name: string,
    units: string,
    displayName?: string
}
export interface Country {
    datetimeLast: {
        utc: string
    },
    coordinates: {
        latitude: number,
        longitude: number
    },
    id: number,
    code: string,
    name: string,
    parameters: Pollution[]
}

function toQueryString(params: Record<string, any>): string {
    return Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");
}


export const fetchCountries = async (): Promise<Country[]> => {
    try {
        const res = await Fetch.get<BaseRes<Country>>('/countries');
        return res.results
    } catch (error) {
        console.error(error);
        return []
    }
}

export interface LocationReq {
    coordinates?: string,
    radius?: number
    limit?: number
}

export const fetchLocations = async (params: LocationReq): Promise<Country[]> => {
    try {
        const queryString = toQueryString(params)
        const res = await Fetch.get<BaseRes<Country>>(`/locations?${queryString}`);
        return res.results
    } catch (error) {
        console.error(error);
        return []
    }
}

export interface Sensor {
    id: EPollution,
    name: string,
    latest: {
        value: number
    }
    // 污染物
    parameter: {
        displayName: string,
        id: number,
        name: string,
        units: string
    },
}

export const fetchSenorsByLocationID = async (locationId: number): Promise<Sensor[]> => {
    try {
        const res = await Fetch.get<BaseRes<Sensor>>(`/locations/${locationId}/sensors`);
        return res.results
    } catch (error) {
        console.error(error);
        return []
    }
}

export enum ETime {
    hour24,
    hour48,
    hour72,
    lastWeek,
    lastMonth
}

export const TTime: { [key in ETime]: string } = {
    [ETime.hour24]: 'Last 24 hours',
    [ETime.hour48]: 'Last 48 hours',
    [ETime.hour72]: 'Last 72 hours',
    [ETime.lastWeek]: 'Last 1 week',
    [ETime.lastMonth]: 'Last 30 days',
}

export interface SensorReq {
    datetimeTo?: string,
    datetimeFrom?: number,
    limit?: number,
    page?: number
}

export interface MeasurementRes {
    period: {
        datetimeFrom: {
            utc: string,
            local: string
        },
    },
    value: number
}

export interface Measurement {
    time: string,
    value: number
}

export const fetchSenorByID = async (sensorsId: number, params?: SensorReq): Promise<Measurement[]> => {
    try {
        let queryString = ''
        if (params) {
            queryString = toQueryString(params)
        }
        const data = await Fetch.get<BaseRes<MeasurementRes>>(`/sensors/${sensorsId}/hours?${queryString}`);
        const formatData = data.results.map((item) => {
            return {
                value: item.value,
                time: moment(item.period.datetimeFrom.utc).format("HH:mm")
            }
        })
        return formatData
    } catch (error) {
        console.error(error);
        return []
    }
}
