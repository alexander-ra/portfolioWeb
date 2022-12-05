import {Page} from "../../models/common/Page"
import {CHANGE_PAGE, COMPLETE_DEV_INTRO} from "../ActionTypes"

export interface StagesReduceModel {
    devIntroCompleted: boolean;
    landingPageLeft: boolean;
    currentPage: Page;
}

export const initialState: StagesReduceModel = {
    devIntroCompleted: false,
    landingPageLeft: false,
    currentPage: Page.LANDING
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
        default:
            return state
    }
}