import {ADD_CIRCLE_MENU_STATE, CHANGE_PAGE, COMPLETE_DEV_INTRO} from "../ActionTypes";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {Page} from "../../models/common/Page";
import {UIOrientation} from "../../models/common/UIOrientation";
import { LayoutType } from "../../models/common/LayoutType";

const completeDevIntro = () => ({
    type: COMPLETE_DEV_INTRO,
    payload: {
        devIntroCompleted: true,
    }
});

const changePage = (page: Page) => ({
    type: CHANGE_PAGE,
    payload: {
        currentPage: page,
    }
});

const addCircleMenuState = (state: CubeMenuStates) => ({
    type: ADD_CIRCLE_MENU_STATE,
    payload: {
        state: state,
    }
});

export { completeDevIntro, changePage, addCircleMenuState };