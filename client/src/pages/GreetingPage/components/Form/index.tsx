import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { errorMonitor } from 'events';
import { useAppDispatch } from '../../../../store/hook';
import {
  FormContainer,
  Form,
  FormTitle,
  FormInputSection,
  FormInputLabel,
  FormInputField,
  FormButton,
  FormLink,
  FormLinkContainer,
  FormLineBreak,
} from './FormComponents';
import { hide, showWithComponent } from '../../../../store/Modal/slice';
import { setUser } from '../../../../store/auth/slice';
import { httpAdapter } from '../../../../adapter/http-request';
import { ErrorModal } from '../../../../components/ErrorModal';

interface ValidationError {
  username?: string;
  password?: string;
}

const RegisterForm = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<ValidationError>({});
  const [requestError, setRequestError] = useState<string | undefined>();
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    if (!username || !password) {
      return setValidationError({
        username: 'Enter username',
        password: 'Enter password',
      });
    }
    setIsLoading(true);
    const { data, error } = await httpAdapter.register(username, password);
    setIsLoading(false);
    if (error) {
      // stay, only hide when close
      // if (!error.status || error.status === 500) {
      //   return dispatch(
      //     showWithComponent(<ErrorModal errorMessage={error.message} />)
      //   );
      // }
      // better display in form
      return dispatch(
        showWithComponent(<ErrorModal errorMessage={error.message} />)
      );
    }
    if (data) {
      // hide the modal and continue
      dispatch(hide());
      return dispatch(setUser({ username: data.username, level: 5 }));
    }
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormTitle>Sign up</FormTitle>
        <FormInputSection>
          <FormInputLabel htmlFor="username">Username</FormInputLabel>
          <FormInputField type="text" ref={usernameRef} />
        </FormInputSection>
        <FormInputSection>
          <FormInputLabel htmlFor="password">Password</FormInputLabel>
          <FormInputField type="password" ref={passwordRef} />
        </FormInputSection>
        <FormButton type="submit">Register</FormButton>
        <FormButton
          type="button"
          onClick={() => {
            dispatch(hide());
          }}
        >
          Cancel
        </FormButton>
      </Form>
    </FormContainer>
  );
};

export const LoginForm = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<ValidationError>({});
  const [requestError, setRequestError] = useState<string | undefined>();
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    if (!username || !password) {
      return setValidationError({
        username: 'Enter username',
        password: 'Enter password',
      });
    }
    setIsLoading(true);
    const { data, error } = await httpAdapter.login(username, password);
    setIsLoading(false);
    if (error) {
      // dispatch error state, just be general
      return dispatch(
        showWithComponent(<ErrorModal errorMessage={error.message} />)
      );
      // if (!error.status || error.status === 500) {
      //   return dispatch(showWithComponent(<div>{error.message}</div>));
      //   return setRequestError('Internal server error');
      // }
      // return setRequestError(error.message);
    }
    if (data) {
      return dispatch(setUser({ username: data.username, level: 5 }));
    }
  };
  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormTitle>Log in and start playing</FormTitle>
        <FormInputSection>
          <FormInputLabel htmlFor="username">Username</FormInputLabel>
          <FormInputField type="text" ref={usernameRef} />
        </FormInputSection>
        <FormInputSection>
          <FormInputLabel htmlFor="password">Password</FormInputLabel>
          <FormInputField type="password" ref={passwordRef} />
        </FormInputSection>
        <FormButton type="submit">Login</FormButton>
        <FormLinkContainer>
          <FormLink to="password_recover">Forgot password?</FormLink>
        </FormLinkContainer>
        <FormLineBreak />
        <FormButton
          type="button"
          onClick={() => {
            dispatch(showWithComponent(<RegisterForm />));
          }}
        >
          Register
        </FormButton>
      </Form>
    </FormContainer>
  );
};
