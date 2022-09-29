import {CLOSE_CUBE, OPEN_CUBE } from "./ActionTypes";

const openCube = () => ({
    type: OPEN_CUBE,
    payload: {
        cubeOpened: true,
    }
});

const closeCube = () => ({
    type: OPEN_CUBE,
    payload: {
        cubeOpened: false,
    }
});

export { openCube, closeCube };