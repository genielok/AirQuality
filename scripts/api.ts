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

export const fetchCountries = async (): Promise<Country[]> => {
    try {
        const res = await Fetch.get<BaseRes<Country>>('/countries');
        return res.results
    } catch (error) {
        console.error(error);
        return []
    }
}
