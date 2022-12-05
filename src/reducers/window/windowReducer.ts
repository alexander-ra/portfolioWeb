import {SET_LAYOUT_TYPE, SET_UI_ORIENTATION, SET_WINDOW_SIZE} from "../ActionTypes"
import {UIOrientation} from "../../components/core/UIOrientation";
import { LayoutType } from "../../components/core/LayoutType";
import BrowserUtils from "../../utils/BrowserUtils";

export interface WindowSize {
    height: number;
    width: number;
}

export interface WindowReduceModel {
    uiOrientation: UIOrientation;
    layoutType: LayoutType;
    windowSize: WindowSize;
}

export const initialState: WindowReduceModel = {
    uiOrientation: UIOrientation.LANDSCAPE,
    layoutType: LayoutType.DESKTOP,
    windowSize: {
        height: 0,
        width: 0,
    }
}

export default function windowReducer(state = initialState, action: any): WindowReduceModel {
    switch (action.type) {
        case SET_UI_ORIENTATION: {
            return {
                ...state,
                uiOrientation: action.payload.uiOrientation
            }
        }
        case SET_LAYOUT_TYPE: {
            return {
                ...state,
                layoutType: action.payload.layoutType
            }
        }
        case SET_WINDOW_SIZE: {
            return {
                ...state,
                windowSize: {
                    height: action.payload.windowHeight,
                    width: action.payload.windowWidth,
                },
                uiOrientation: BrowserUtils.getOrientation(action.payload.windowWidth, action.payload.windowHeight)
            }
        }
        default:
            return state
    }
}