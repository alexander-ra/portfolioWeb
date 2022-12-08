import {SET_LAYOUT_TYPE, SET_THEME, SET_UI_ORIENTATION, SET_WINDOW_SIZE} from "../ActionTypes";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {Page} from "../../models/common/Page";
import {UIOrientation} from "../../components/core/UIOrientation";
import { LayoutType } from "../../components/core/LayoutType";
import Utils from "../../utils/Utils";
import BrowserUtils from "../../utils/BrowserUtils";
import { ThemeType } from "../../components/core/ThemeType";

const setUiOrientation = (uiOrientation: UIOrientation) => ({
    type: SET_UI_ORIENTATION,
    payload: {
        uiOrientation,
    }
});

const setLayoutType = (layoutType: LayoutType) => ({
    type: SET_LAYOUT_TYPE,
    payload: {
        layoutType,
    }
});

const setWindowSize = (windowWidth: number, windowHeight: number) => ({
    type: SET_WINDOW_SIZE,
    payload: {
        windowWidth,
        windowHeight,
    }
});

const setTheme = (theme: ThemeType) => ({
    type: SET_THEME,
    payload: {
        theme,
    }
});

export { setUiOrientation, setLayoutType, setWindowSize, setTheme };