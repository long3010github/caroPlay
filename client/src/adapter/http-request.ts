import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  Axios,
} from 'axios';

interface ResponseType<T> {
  data?: T;
  error?: ErrorType;
}

interface ErrorType {
  status?: number;
  message?: string;
}

interface LoginResponse {
  username: string;
  id: string;
  win: number;
  lose: number;
}

interface RegisterResponse {
  username: string;
  id: string;
  win: number;
  lose: number;
}

interface IUserInfo extends LoginResponse {}

interface ISilentRefreshResponse {
  success: boolean;
}

interface LogoutResponse {
  success: boolean;
}

/**
 * create an axios instance
 */
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API || 'http://localhost:3000/',
  withCredentials: true,
});

/**
 * base method using for API calling, will be reuse in other API call
 * @param config axios request config type
 * @param T generic type use for typing response data
 * @returns a promise which will be resolve with an object type ResponseType<T>
 */
const request = async <T>(
  config: AxiosRequestConfig
): Promise<ResponseType<T>> => {
  try {
    const response = await axiosInstance.request<T>(config);
    return { data: response.data };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // here we only return error status if response status code is 4xx - 5xx
      // the status code property will be used to check type of error later
      if (error.response) {
        const responseError = error as AxiosError<ErrorType>;
        return {
          error: responseError.response?.data,
        };
      }
      if (error.request) {
        return {
          error: {
            message: 'Internal server error',
          },
        };
      }
    }
    return {
      error: {
        message: 'Internal server error',
      },
    };
  }
};

const login = async (username: string, password: string) => {
  const result = await request<LoginResponse>({
    url: '/auth/login',
    method: 'POST',
    data: {
      username,
      password,
    },
  });
  return result;
};

const register = async (username: string, password: string) => {
  const result = await request<RegisterResponse>({
    url: '/auth/register',
    method: 'POST',
    data: {
      username,
      password,
    },
  });
  return result;
};

const logout = async () => {
  const result = await request<LogoutResponse>({
    url: '/auth/refresh/logout',
    method: 'GET',
  });
  return result;
};

const silentRefresh = async () => {
  const result = await request<ISilentRefreshResponse>({
    url: '/auth/refresh/',
    method: 'GET',
  });
  return result;
};

const fetchUserInfo = async () => {
  const firstRequestResult = await request<IUserInfo>({
    url: '/user',
    method: 'GET',
  });
  if (firstRequestResult.error && firstRequestResult.error.status === 401) {
    const silentRefreshResult = await silentRefresh();
    if (silentRefreshResult.error) {
      return { error: silentRefreshResult.error };
    }
    const secondRequestResult = await request<IUserInfo>({
      url: '/user',
      method: 'GET',
    });
    return secondRequestResult;
  }
  return firstRequestResult;
};

export const httpAdapter = {
  request,
  login,
  register,
  logout,
  fetchUserInfo,
};
