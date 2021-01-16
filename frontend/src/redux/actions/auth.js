import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  AUTH_ERROR,
  LOADED_USER,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";
import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../../utils/setAuthToken";

//Action for loading user
export const loadUser = () => async (dispatch) => {
  setAuthToken(localStorage.accessToken);
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  try {
    const user = await axios.get("/auth/user", config);
    dispatch({
      type: LOADED_USER,
      payload: user.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Actions for register
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const body = JSON.stringify({ username: name, email, password });

  try {
    const res = await axios.post("/user/register", body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    // console.log(err);
    const errors = err.response.data.errors;
    if (errors) {
      console.log(errors);
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

//Actions for login
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post("/auth/login", body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//Action for logout
export const logout = () => async dispatch => {
  console.log("Logout Action Creator");
  dispatch({
    type: LOGOUT
  })
  dispatch({
    type : CLEAR_PROFILE
  })
  setAuthToken(localStorage.accessToken);
};