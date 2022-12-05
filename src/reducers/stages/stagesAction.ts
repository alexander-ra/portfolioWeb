import {CHANGE_PAGE, COMPLETE_DEV_INTRO} from "../ActionTypes";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {Page} from "../../models/common/Page";
import {UIOrientation} from "../../components/core/UIOrientation";
import { LayoutType } from "../../components/core/LayoutType";

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

export { completeDevIntro, changePage };