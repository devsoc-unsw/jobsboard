/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from '../config';

// TODO: for the future:
// wrap AxiosResponse in a custom class to enable function chaining and passing parameters
// similar to `expect` in supertest to replace passing by parameter (i.e. auth token).
//  - support `send` and `set` like supertest
export default class Server {
  private static axios: AxiosInstance = axios.create({
    baseURL: config.apiUrl,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static get<T = any, R = AxiosResponse<T>>(url: string, token?: string): Promise<R> {
    const server = Server.axios;
    return server.get(url, {
      headers: {
        Authorization: token,
      },
    });
  }

  public static post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    payload?: D,
    token?: string,
  ): Promise<R> {
    const server = Server.axios;
    return server.post(url, payload, {
      headers: {
        Authorization: token,
      },
    });
  }

  public static put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    payload?: D,
    token?: string,
  ): Promise<R> {
    const server = Server.axios;
    return server.put(url, payload, {
      headers: {
        Authorization: token,
      },
    });
  }

  public static delete<T = any, R = AxiosResponse<T>>(url: string, token?: string): Promise<R> {
    const server = Server.axios;
    return server.delete(url, {
      headers: {
        Authorization: token,
      },
    });
  }

  public static patch<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    payload: D,
    token?: string,
  ): Promise<R> {
    const server = Server.axios;
    return server.patch(url, payload, {
      headers: {
        Authorization: token,
      },
    });
  }
}
