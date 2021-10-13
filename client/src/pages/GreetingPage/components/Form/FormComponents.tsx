import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const FormContainer = styled.div`
  background-color: #0e0b0b;
  opacity: 0.75;
  border-radius: 15px;
  box-sizing: border-box;
  box-shadow: 0 0 10px black;
  color: white;
  padding: 20px 20px;
  max-width: 350px;
  height: fit-content;
`;

export const Form = styled.form`
  max-height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const FormTitle = styled.div`
  color: white;
  font-size: 25px;
  line-height: 1.3;
  margin-bottom: 40px;
  text-align: center;
  height: fit-content;
`;

export const FormInputSection = styled.div`
  width: 100%;
  display: inline-block;
  box-sizing: inherit;
  height: fit-content;
  margin-bottom: 30px;
`;

export const FormInputLabel = styled.label`
  font-size: 15px;
  height: fit-content;
  display: block; // for margin along y-axis an inline element
  margin-bottom: 15px;
`;

export const FormInputField = styled.input`
  background-color: #635555;
  box-sizing: border-box;
  border-radius: 5px;
  color: white;
  font-size: 20px;
  height: 46px;
  line-height: 36px;
  padding: 10px;
  width: 100%;

  :focus {
    /* outline: none !important; */
    border: 1px solid purple;
    box-shadow: 0 0 10px #959da7;
  }
`;

export const FormButton = styled.button`
  height: 40px;
  width: 60%;
  margin-bottom: 45px;
  font-size: 25px;
  color: white;
  background-color: #b628a3;
  border-radius: 25px;
  border: 1px solid black;
  cursor: pointer;

  :hover {
    transition: 0.5s ease-in-out;
    background-color: purple;
  }
`;

export const FormLinkContainer = styled.div`
  text-decoration: none;
  color: white;
  text-align: center;
  margin-bottom: 30px;
`;

export const FormLink = styled(NavLink)`
  text-decoration: none;
  color: white;
`;

export const FormLineBreak = styled.div`
  align-items: center;
  border-bottom: 1px solid rgb(218 221 225);
  display: flex;
  margin-bottom: 30px;
  text-align: center;
`;
