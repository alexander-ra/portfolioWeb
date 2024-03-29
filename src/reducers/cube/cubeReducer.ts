import {CLOSE_CUBE, OPEN_CUBE, SELECT_MENU} from "../ActionTypes";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";

export interface CubeReduceModel {
    cubeOpened: boolean;
    selectedMenu: CubeMenuStates;
}

const initialState: CubeReduceModel = {
    cubeOpened: false,
    selectedMenu: CubeMenuStates.NONE
};

export default function cubesReducer(state = initialState, action: any): CubeReduceModel {
    switch (action.type) {
        case OPEN_CUBE: {
            return {
                ...state,
                cubeOpened: true
            }
        }
        case SELECT_MENU: {
            return {
                ...state,
                selectedMenu: action.payload.selectedMenu
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