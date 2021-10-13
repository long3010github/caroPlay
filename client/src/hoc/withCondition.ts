import React from 'react';

type ConditionalFn = () => boolean;

const withCondition = (
  conditionalFn: ConditionalFn,
  Component: JSX.Element,
  EitherComponent: JSX.Element
): JSX.Element => (conditionalFn() ? Component : EitherComponent);

export default withCondition;
