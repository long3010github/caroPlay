import React from 'react';
import { InputProps } from './type';

const Input = ({ label, name, type, ...rest }: InputProps): JSX.Element => (
  <>
    <label htmlFor={label}>{label}</label>
    <input type={type} name={name} {...rest} />
  </>
);

export default Input;
