import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '@/constants/APiConfig';

export const BASE_URL = 'https://backend.truementor.in/api/v1/';
// export const BASE_URL = Platform.OS === 'ios' ? 'http://localhost:3000/api/v1/' : 'http://192.168.1.36:3000/api/v1/';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiResponse<T = any> {
  res?: T;
  error?: string;
}

async function fetchWithTimeout(
  resource: string,
  options: RequestInit,
  timeout = 15000,
) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function api<T = any>(
  endpoint: string,
  method: RequestMethod = 'GET',
  data?: any,
  headers: Record<string, string> = {},
): Promise<ApiResponse<T>> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    // Prevent sending body for GET requests
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    // Handle GET query params if data is provided
    let url = `${BASE_URL}${endpoint}`;
    if (method === 'GET' && data && typeof data === 'object') {
      const queryString = new URLSearchParams(data).toString();
      url += `?${queryString}`;
    }
    // console.log('API REQUEST →', {
    //   url,
    //   method,
    //   headers: options.headers,
    //   body: method !== 'GET' ? data : null,
    // });
    const response = await fetchWithTimeout(url, options);
    const contentType = response.headers.get('content-type');

    const responseData = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    // console.log('API RESPONSE →', {
    //   url,
    //   method,
    //   status: response.status,
    //   responseData,
    // });

    if (!response.ok) {
      return {
        error:
          (responseData && responseData.message) ||
          `Request failed with status ${response.status}`,
      };
    }

    return { res: responseData };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { error: 'Request timed out. Please try again.' };
    }
    return { error: err.message || 'Network error' };
  }
}

export async function apiWithAuth<T = any>(
  endpoint: string,
  method: RequestMethod,
  data?: any,
  token?: string,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const response = await api<T>(endpoint, method, data, headers);

  if (response.error === 'Not authorized, token failed') {
    await AsyncStorage.clear();
  }

  return response;
}
