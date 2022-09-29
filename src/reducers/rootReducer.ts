import { combineReducers } from "redux";
import cubesReducer from "./cubeReducer";
import othersReducer from "./othersReducer";

export default combineReducers({ cubesReducer, othersReducer });
