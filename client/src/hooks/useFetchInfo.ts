import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hook';
import { RootState } from '../store';
import { httpAdapter } from '../adapter/http-request';
import { setUser } from '../store/auth/slice';

export const useFetchInfo = () => {
  const { isAuth } = useAppSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorCode, setErrorCode] = useState<number | undefined>();
  const dispatch = useAppDispatch();

  const fetchUserInfo = async () => {
    if (!isAuth) {
      try {
        const { data, error } = await httpAdapter.fetchUserInfo();
        /**
         * here we will have to check error to response
         * error with 401 status will result in redirecting to login
         * otherwise show error page (will be made later)
         */
        if (error) {
          setIsLoading(false);
          return setErrorCode(error.status);
        }
        if (data) {
          setIsLoading(false);
          dispatch(setUser({ username: data.username, level: 5 }));
        }
      } catch (error: unknown) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);
  return { isLoading, errorCode, isAuth };
};
