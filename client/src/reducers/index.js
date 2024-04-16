// reducers/index.js
import { combineReducers } from "redux";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  user: userReducer,
  // Other reducers...
});

export default rootReducer;
