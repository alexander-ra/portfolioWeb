import { combineReducers } from "redux";
import cubesReducer from "./cube/cubeReducer";
import stagesReducer from "./stages/stagesReducer";

export default combineReducers({ cubesReducer, stagesReducer });
