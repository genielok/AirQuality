const BASE_URL = 'https://api.openaq.org/v3';

/**
 * 通用请求方法
 * @param {string} url - API 的相对路径
 * @param {string} method - 请求方法 ('GET', 'POST', etc.)
 * @param {any} body - 请求体 (POST、PUT 等需要)
 * @param {object} headers - 自定义请求头
 * @returns {Promise<T>} - 返回的 JSON 数据
 */
const request = async <T>(
    url: string,
    method: string = 'GET',
    body?: any,
    headers: Record<string, string> = {}
): Promise<T> => {
    try {
        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': '78ce21486e3e7056b747dbe1bf9d1bb8bb9d2096dc3aa3749ee4205ed84acb87',
                ...headers,
            },
        };

        if (body && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${BASE_URL}${url}`, options);

        // 检查响应状态
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error('Fetch error:', error.message);
        throw error; // 或根据需求返回自定义错误对象
    }
};

/**
 * GET 请求封装
 * @param {string} url - API 的相对路径
 * @param {object} headers - 自定义请求头
 * @returns {Promise<T>} - 返回的 JSON 数据
 */
const get = async <T>(url: string, headers?: Record<string, string>): Promise<T> => {
    return request<T>(url, 'GET', undefined, headers);
};

/**
 * POST 请求封装
 * @param {string} url - API 的相对路径
 * @param {object} body - 请求体
 * @param {object} headers - 自定义请求头
 * @returns {Promise<T>} - 返回的 JSON 数据
 */
const post = async <T>(url: string, body: any, headers?: Record<string, string>): Promise<T> => {
    return request<T>(url, 'POST', body, headers);
};

// 导出方法
export default {
    get,
    post,
};
