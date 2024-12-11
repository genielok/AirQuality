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
interface Country {
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
    coordinates: string,
    radius: number
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
    parameter: {
        displayName: string,
        id: number,
        name: string,
        units: string
    }
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
