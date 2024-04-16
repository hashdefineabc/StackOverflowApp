// userReducer.js
import {
  LOGIN_USER_SUCCESS,
  REGISTER_USER_SUCCESS,
  LOGOUT,
  SET_USER,
} from "../actions/actionTypes";

const initialState = {
  user: null,
  loggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: action.payload,
      };
    case REGISTER_USER_SUCCESS:
      return {
        ...state,
        loggedIn: true,
        user: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        loggedIn: false,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        loggedIn: true,
      };
    default:
      return state;
  }
};

export default userReducer;
