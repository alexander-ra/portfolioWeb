import { Page } from "../../models/common/Page"
import {CHANGE_PAGE, COMPLETE_DEV_INTRO, SELECT_MENU} from "../ActionTypes"
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";

export interface StagesReduceModel {
    devIntroCompleted: boolean;
    currentPage: Page;
}

export const initialState: StagesReduceModel = {
    devIntroCompleted: false,
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
                currentPage: action.payload.currentPage
            }
        }
        default:
            return state
    }
}