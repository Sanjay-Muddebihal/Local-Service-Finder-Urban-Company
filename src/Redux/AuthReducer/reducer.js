import { AUTH_ERROR, AUTH_LOADING, AUTH_SUCCESS, AUTH_LOGOUT, SET_USER } from "./actionTypes";

const initState = {
  token:     "",
  user:      null,   // { uid, name, email, phone, avatar }
  isAuth:    false,
  isLoading: false,
  isError:   false,
  errorMsg:  "",
};

export const AuthReducer = (state = initState, { type, payload }) => {
  switch (type) {
    case AUTH_LOADING:
      return { ...state, isLoading: true, isError: false, errorMsg: "" };
    case "OTP_SENT":
      return { ...state, isLoading: false, isError: false };
    case AUTH_SUCCESS:
      return { ...state, token: payload.token, user: payload.user, isAuth: true, isLoading: false, isError: false };
    case SET_USER:
      return { ...state, user: payload, isAuth: true, isLoading: false };
    case AUTH_ERROR:
      return { ...state, isLoading: false, isError: true, errorMsg: payload || "Something went wrong" };
    case AUTH_LOGOUT:
      return { ...initState };
    default:
      return state;
  }
};
