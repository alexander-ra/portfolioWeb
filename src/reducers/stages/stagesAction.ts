import {CHANGE_PAGE, COMPLETE_DEV_INTRO, SET_UI_ORIENTATION} from "../ActionTypes";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {Page} from "../../models/common/Page";
import {UIOrientation} from "../../components/core/UIOrientation";

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

const setUiOrientation = (uiOrientation: UIOrientation) => ({
    type: SET_UI_ORIENTATION,
    payload: {
        uiOrientation,
    }
});
export { completeDevIntro, changePage, setUiOrientation };