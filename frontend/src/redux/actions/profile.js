import { PROFILE_LOADED, PROFILE_LOAD_ERROR } from "./types";
import axios from "axios";
import { setAlert } from "./alert";

export const getCurrentProfile = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  try {
    const res = await axios.get("/profile", config);
    dispatch({
      type: PROFILE_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_LOAD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const createProfile = (profile, history, edit=false) => async (dispatch) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const body = profile
  body.firstname = "r1c0";
  body.lastname = "r1c0";
  try {
    const res = await axios.post('/profile/update' , body, config);

    dispatch({
      type : PROFILE_LOADED,
      payload : res.data
    })

    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created" , "success"))

    if(!edit){
      history.push('/dashboard');
    }

  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: PROFILE_LOAD_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
