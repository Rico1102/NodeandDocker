import React, { Fragment, useEffect, useState } from "react";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createProfile, getCurrentProfile } from "../../redux/actions/profile";

const EditProfile = ({profile : {profile , loading} , createProfile, getCurrentProfile, history}) => {

  if (loading || profile === null) {
    <Redirect to="/dashboard" />;
  }

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    company: "",
    website: "",
    status: "",
    location: "",
    skills: "",
    bio: "",
    githubusername: "",
    youtube: "",
    facebook: "",
    linkedin: "",
    instagram: "",
    twitter: "",
  });

  useEffect(() => {
    getCurrentProfile();
    setFormData({
      firstname:
        loading || !profile
          ? ""
          : profile.firstname,
      lastname:
        loading || !profile
          ? ""
          : profile.lastname,
      company:
        loading || !profile
          ? ""
          : profile.company,
      location:
        loading || !profile
          ? ""
          : profile.location,
      status:
        loading || !profile
          ? ""
          : profile.status,
      skills:
        loading || !profile
          ? ""
          : profile.skills.join(),
      bio:
        loading || !profile
          ? ""
          : profile.bio,
      githubusername:
        loading || !profile
          ? " "
          : profile.githubusername,
      youtube:
        loading ||
        !profile ||
        !profile.social
          ? ""
          : profile.social.youtube,
      instagram:
        loading ||
        !profile ||
        !profile.social
          ? ""
          : profile.social.instagram,
      facebook:
        loading ||
        !profile ||
        !profile.social
          ? ""
          : profile.social.facebook,
      linkedin:
        loading ||
        !profile ||
        !profile.social
          ? ""
          : profile.social.linkedin,
    });
  }, [loading]);

  const [displayProfileInput, toggleProfileInputs] = useState(false);

  const handleFormChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleProfileInputs = (event) => {
    toggleProfileInputs(!displayProfileInput);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createProfile(formData, history, true);
  };

  const {
    firstname,
    lastname,
    company,
    website,
    status,
    skills,
    bio,
    githubusername,
    youtube,
    facebook,
    linkedin,
    instagram,
    twitter,
    location,
  } = formData;
  return (
    <Fragment>
      <h1 className="large text-primary">Update Your Profile</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <select name="status" value={status} onChange={handleFormChange}>
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text">
            Give us an idea of where you are at in your career
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={company}
            onChange={handleFormChange}
          />
          <small className="form-text">
            Could be your own company or one you work for
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Website"
            name="website"
            value={website}
            onChange={handleFormChange}
          />
          <small className="form-text">
            Could be your own or a company website
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            name="location"
            value={location}
            onChange={handleFormChange}
          />
          <small className="form-text">
            City & state suggested (eg. Boston, MA)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Skills"
            name="skills"
            value={skills}
            onChange={handleFormChange}
          />
          <small className="form-text">
            Please use comma separated values (eg. HTML,CSS,JavaScript,PHP)
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            value={githubusername}
            onChange={handleFormChange}
          />
          <small className="form-text">
            If you want your latest repos and a Github link, include your
            username
          </small>
        </div>
        <div className="form-group">
          <textarea
            placeholder="A short bio of yourself"
            name="bio"
            value={bio}
            onChange={handleFormChange}
          ></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button
            type="button"
            className="btn btn-light"
            onClick={handleProfileInputs}
          >
            Add Social Network Links
          </button>
          <span>Optional</span>
        </div>
        {displayProfileInput && (
          <Fragment>
            <div className="form-group social-input">
              <i className="fab fa-twitter fa-2x"></i>
              <input
                type="text"
                placeholder="Twitter URL"
                name="twitter"
                value={twitter}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-facebook fa-2x"></i>
              <input
                type="text"
                placeholder="Facebook URL"
                name="facebook"
                value={facebook}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-youtube fa-2x"></i>
              <input
                type="text"
                placeholder="YouTube URL"
                name="youtube"
                value={youtube}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-linkedin fa-2x"></i>
              <input
                type="text"
                placeholder="Linkedin URL"
                name="linkedin"
                value={linkedin}
                onChange={handleFormChange}
              />
            </div>

            <div className="form-group social-input">
              <i className="fab fa-instagram fa-2x"></i>
              <input
                type="text"
                placeholder="Instagram URL"
                name="instagram"
                value={instagram}
                onChange={handleFormChange}
              />
            </div>
          </Fragment>
        )}
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(EditProfile)
);
