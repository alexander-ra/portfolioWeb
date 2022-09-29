import {CLOSE_CUBE, OPEN_CUBE, SELECT_MENU} from "./ActionTypes";
import {CubeMenuStates} from "../models/landing/CubeMenuStates";

const openCube = () => ({
    type: OPEN_CUBE,
    payload: {
        cubeOpened: true,
    }
});

const selectMenu = (menu: CubeMenuStates) => ({
    type: SELECT_MENU,
    payload: {
        selectedMenu: menu,
    }
});

const closeCube = () => ({
    type: OPEN_CUBE,
    payload: {
        cubeOpened: false,
    }
});

export { openCube, closeCube, selectMenu };