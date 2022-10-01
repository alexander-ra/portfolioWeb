import { Page } from "../models/common/Page"
import {COMPLETE_DEV_INTRO, SELECT_MENU} from "../utils/ActionTypes"

export const initialState = {
    devIntroCompleted: false,
    currentPage: Page.LANDING
}

export default function stagesReducer(state = initialState, action: any) {
    switch (action.type) {
        case COMPLETE_DEV_INTRO: {
            return {
                ...state,
                devIntroCompleted: true
            }
        }
        case CHANGE_PAGE: {
            return {
                ...state,
                currentPage: action.payload.newPage
            }
        }
        default:
            return state
    }
}