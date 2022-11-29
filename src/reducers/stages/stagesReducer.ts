import {Page} from "../../models/common/Page"
import {CHANGE_PAGE, COMPLETE_DEV_INTRO, SET_UI_ORIENTATION} from "../ActionTypes"
import {UIOrientation} from "../../components/core/UIOrientation";

export interface StagesReduceModel {
    devIntroCompleted: boolean;
    landingPageLeft: boolean;
    currentPage: Page;
    uiOrientation: UIOrientation;
}

export const initialState: StagesReduceModel = {
    devIntroCompleted: false,
    landingPageLeft: false,
    currentPage: Page.LANDING,
    uiOrientation: UIOrientation.LANDSCAPE
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
        default:
            return state
    }
}