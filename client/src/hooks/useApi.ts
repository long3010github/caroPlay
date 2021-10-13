import React, { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { httpAdapter } from '../adapter/http-request';

export const useApi = (config: AxiosRequestConfig) => {
  const [data, setData] = useState<any>(undefined);
  const [error, setError] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        const result = await httpAdapter.request(config);
        setData(result.data);
        setError(result.error);
      } catch (err: unknown) {
        setError(err);
      }
      setIsLoading(false);
    };
    init();
  }, []);
  return { data, error, isLoading };
};
