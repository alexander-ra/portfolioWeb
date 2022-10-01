import { combineReducers } from "redux";
import cubesReducer from "./cubeReducer";
import stagesReducer from "./stagesReducer";

export default combineReducers({ cubesReducer, stagesReducer });
