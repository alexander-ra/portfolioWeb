import {CLOSE_CUBE, COMPLETE_DEV_INTRO, OPEN_CUBE, SELECT_MENU} from "./ActionTypes";
import {CubeMenuStates} from "../models/landing/CubeMenuStates";

const completeDevIntro = () => ({
    type: COMPLETE_DEV_INTRO,
    payload: {
        devIntroCompleted: true,
    }
});

const changePage = () => ({
    type: COMPLETE_DEV_INTRO,
    payload: {
        newPage: true,
    }
});

export { completeDevIntro };