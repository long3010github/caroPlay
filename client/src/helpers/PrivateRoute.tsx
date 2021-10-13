import React from 'react';
import {
  Route,
  useLocation,
  useHistory,
  Redirect,
  RouteProps,
} from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
  conditionalFn: () => boolean;
  redirectPath: string;
}

const PrivateRoute = ({
  path,
  exact,
  children,
  conditionalFn,
  redirectPath,
}: PrivateRouteProps) => {
  const location = useLocation();
  const history = useHistory();
  return (
    <Route path={path} exact={exact}>
      {conditionalFn() ? (
        children
      ) : (
        <Redirect to={`${redirectPath}?from=${location.pathname}`} />
      )}
    </Route>
  );
};

export default PrivateRoute;
