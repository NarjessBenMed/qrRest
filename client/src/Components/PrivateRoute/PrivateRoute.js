import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import setAuthToken from '../../utils/setAuthToken';
const PrivateRoute = ({ children, path, ...rest }) => {
  const { isAuthenticated, status } = useSelector((state) => state.auth);
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  return (
    <Route
      {...rest}
      render={() =>
        !isAuthenticated && status !== 'loading' ? <Redirect to='/signin' /> : children
      }
    />
  );
};

export default PrivateRoute;
