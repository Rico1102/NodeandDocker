import "./App.css";
import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from "./components/layout/Alert";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import { loadUser } from "./redux/actions/auth";
import PublicRoutes from "./components/routes/PublicRoutes";
import PrivateRoutes from "./components/routes/PrivateRoutes";
// Redux imports
import { Provider } from "react-redux";
import store from "./redux/store";

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <PublicRoutes exact path="/" component={Landing} restricted={true} />
          <section className="container">
            <Alert />
            <Switch>
              <PublicRoutes
                exact
                path="/login"
                component={Login}
                restricted={true}
              />
              <PublicRoutes
                exact
                path="/register"
                component={Register}
                restricted={true}
              />
              <PrivateRoutes exact path="/dashboard" component={Dashboard} />
              <PrivateRoutes
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoutes
                exact
                path="/edit-profile"
                component={EditProfile}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
