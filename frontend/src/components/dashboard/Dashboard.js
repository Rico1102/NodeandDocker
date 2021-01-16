import { connect } from "react-redux";
import React, { useEffect, Fragment } from "react";
import { Link } from 'react-router-dom';
import { getCurrentProfile } from "../../redux/actions/profile";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardActions";

const Dashboard = ({ getCurrentProfile, auth, profile }) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  return auth.loading || (profile.loading && profile.profile === null) ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {auth.user.username}
      </p>
      {profile.profile !== null ? (
        <DashboardActions />
      ) : (
        <Fragment>
          <p>You have not yet setup a profile, please add some info</p>
          <Link to="/create-profile" className='btn btn-primary my-1'>Create Profile</Link>
        </Fragment>
      )}
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
