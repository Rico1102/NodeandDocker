import axios from "axios";

const setAuthToken = (accessToken) => {
  if (accessToken) {
    axios.defaults.headers.common["x-auth-token"] = accessToken;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
