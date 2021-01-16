import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const PrivateRoutes = ({ component: Component, auth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !auth.loading && (auth.isAuthenticated ? <Component {...props} /> : <Redirect to="/" />)
      }
    />
  );
};

const mapStateToProps = (state) => ({
  auth : state.auth
})

export default connect(mapStateToProps)(PrivateRoutes);