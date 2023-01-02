import {CubeMenuStates} from "./CubeMenuStates";

export interface CubeRotationState {
    dragX?: number;
    dragY: number;
    selectedMenuState: CubeMenuStates;
}