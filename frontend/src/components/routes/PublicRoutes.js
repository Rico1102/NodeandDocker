import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const PublicRoutes = ({ component: Component, auth, restricted, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        restricted && auth.isAuthenticated ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

const mapStateToProps = (state) => ({
    auth : state.auth
})

export default connect(mapStateToProps)(PublicRoutes) ;
