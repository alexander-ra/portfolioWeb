import {Page} from "../../models/common/Page"
import {CHANGE_PAGE, COMPLETE_DEV_INTRO, SET_LAYOUT_TYPE, SET_UI_ORIENTATION} from "../ActionTypes"
import {UIOrientation} from "../../components/core/UIOrientation";
import { LayoutType } from "../../components/core/LayoutType";

export interface StagesReduceModel {
    devIntroCompleted: boolean;
    landingPageLeft: boolean;
    currentPage: Page;
    uiOrientation: UIOrientation;
    layoutType: LayoutType;
}

export const initialState: StagesReduceModel = {
    devIntroCompleted: false,
    landingPageLeft: false,
    currentPage: Page.LANDING,
    uiOrientation: UIOrientation.LANDSCAPE,
    layoutType: LayoutType.DESKTOP,
}

export default function stagesReducer(state = initialState, action: any): StagesReduceModel {
    switch (action.type) {
        case COMPLETE_DEV_INTRO: {
            return {
                ...state,
                devIntroCompleted: true
            }
        }
        case CHANGE_PAGE: {
            console.log(action);
            return {
                ...state,
                landingPageLeft: state.landingPageLeft || state.currentPage !== Page.LANDING || action.payload.currentPage === Page.LANDING,
                currentPage: action.payload.currentPage
            }
        }
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
        default:
            return state
    }
}