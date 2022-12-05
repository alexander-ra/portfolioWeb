import { combineReducers } from "redux";
import chessReducer from "./chess/chessReducer";
import chessBoardReducer from "./chessBoard/chessBoardReducer";
import cubesReducer from "./cube/cubeReducer";
import stagesReducer from "./stages/stagesReducer";
import windowReducer from "./window/windowReducer";

export default combineReducers({ cubesReducer, stagesReducer, chessReducer, chessBoardReducer, windowReducer });
