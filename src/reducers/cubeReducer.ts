import {CLOSE_CUBE, OPEN_CUBE } from "../utils/ActionTypes";

const initialState = {
    cubeOpened: false,
};

export default function cubesReducer(state = initialState, action: any) {
    console.log(action);
    switch (action.type) {
        case OPEN_CUBE: {
            return {
                ...state,
                cubeOpened: true
            }
        }
        case CLOSE_CUBE: {
            return {
                ...state,
                cubeOpened: false
            }
        }
        default:
            return state
    }
}