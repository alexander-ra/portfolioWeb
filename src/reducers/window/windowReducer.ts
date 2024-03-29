import {SET_LAYOUT_TYPE, SET_THEME, SET_UI_ORIENTATION, SET_WINDOW_SIZE} from "../ActionTypes"
import {UIOrientation} from "../../models/common/UIOrientation";
import {LayoutType} from "../../models/common/LayoutType";
import BrowserUtils from "../../utils/BrowserUtils";
import {ThemeType} from "../../models/common/ThemeType";
import StorageUtil, {StorageKey} from "../../utils/StorageUtil";

export interface WindowSize {
    height: number;
    width: number;
}

export interface WindowReduceModel {
    uiOrientation: UIOrientation;
    layoutType: LayoutType;
    windowSize: WindowSize;
    theme: ThemeType;
}

export const initialState: WindowReduceModel = {
    uiOrientation: UIOrientation.LANDSCAPE,
    layoutType: LayoutType.NATIVE,
    windowSize: {
        height: 0,
        width: 0,
    },
    theme: StorageUtil.getStorage(StorageKey.THEME) === "DARK" ? ThemeType.DARK : ThemeType.LIGHT,
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
        case SET_THEME: {
            StorageUtil.setStorage(StorageKey.THEME, action.payload.theme);
            return {
                ...state,
                theme: action.payload.theme
            }
        }
        default:
            return state
    }
}