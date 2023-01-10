import {Page} from "../../models/common/Page"
import {ADD_CIRCLE_MENU_STATE, CHANGE_PAGE, COMPLETE_DEV_INTRO} from "../ActionTypes"
import {ResourcePack} from "../../models/common/ResourcePack";

export interface StagesReduceModel {
    devIntroCompleted: boolean;
    landingPageLeft: boolean;
    currentPage: Page;
    visitedStates: string[];
    resourcesLoaded: ResourcePack[];
}

export const initialState: StagesReduceModel = {
    devIntroCompleted: false,
    landingPageLeft: false,
    currentPage: Page.LANDING,
    visitedStates: [],
    resourcesLoaded: [],
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
            window.history.pushState(null, null, `/${action.payload.currentPage.toLowerCase()}`);
            return {
                ...state,
                landingPageLeft: state.landingPageLeft || state.currentPage !== Page.LANDING || action.payload.currentPage === Page.LANDING,
                currentPage: action.payload.currentPage
            }
        }
        case ADD_CIRCLE_MENU_STATE: {
            const newVisitedStates = [...state.visitedStates, action.payload.state];
            return {
                ...state,
                visitedStates: newVisitedStates
            }
        }

        default:
            return state
    }
}