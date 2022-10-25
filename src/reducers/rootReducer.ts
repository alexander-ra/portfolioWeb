import { combineReducers } from "redux";
import chessReducer from "./chess/chessReducer";
import cubesReducer from "./cube/cubeReducer";
import stagesReducer from "./stages/stagesReducer";

export default combineReducers({ cubesReducer, stagesReducer, chessReducer });
