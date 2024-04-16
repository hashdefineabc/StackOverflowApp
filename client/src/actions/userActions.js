// userActions.js
import { LOGIN_USER_SUCCESS, REGISTER_USER_SUCCESS, LOGOUT, SET_USER } from './actionTypes';

export const loginUserSuccess = (user) => ({
  type: LOGIN_USER_SUCCESS,
  payload: user,
});

export const registerUserSuccess = (user) => {
  return {
    type: REGISTER_USER_SUCCESS,
    payload: user,
  };
};

export const logout = (user) => ({
  type: LOGOUT,
  payload: user,
});

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});
