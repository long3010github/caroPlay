import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import NavBar from './containers/NavBar';
import UserPage from './pages/User';
import NotFound from './pages/NotFound';
import PrivateRoute from './helpers/PrivateRoute';
import { RootModal } from './containers/Modal';
import { Home } from './pages/Home/index';
import { useFetchInfo } from './hooks/useFetchInfo';

export const AppRouter = () => {
  const { isLoading, errorCode } = useFetchInfo();
  if (isLoading) return <div>Loading</div>;
  if (errorCode && errorCode !== 401) {
    console.log(errorCode);
    return <div>Oops, server error</div>;
  }
  return (
    <Router>
      <NavBar />
      <RootModal />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/login">
          <Redirect to="/" />
        </Route>
        {/* <PrivateRoute
              path="/me"
              conditionalFn={() => !!isAuth}
              redirectPath="/login"
            >
              <UserPage />
            </PrivateRoute> */}
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
