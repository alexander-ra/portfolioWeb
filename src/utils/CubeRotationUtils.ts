import {CubeMenuStates} from "../models/landing/CubeMenuStates";
import {Position} from "../models/common/Position";
import Cube from "../components/landing/Cube/Cube";
import BrowserUtils from "./BrowserUtils";
import { CubeRotationState } from "../models/landing/CubeRotationState";

export class CubeRotationUtils {
    private static readonly CUBE_SIDE_ROTATION_DEG = 50;
    private static readonly SECTION_INITIAL_DIFFERENCE_DEG = 35;
    private static readonly SECTION_FREE_RANGE_DEG = 20;
    private static readonly SECTION_VERTICAL_OFFSET_DEG= 8;
    // How fast the Cube is rotated by dragging. Value less than 1 is not commented.
    private static readonly ROTATION_SENSITIVITY_DESKTOP = 2;
    private static readonly ROTATION_SENSITIVITY_MOBILE = 3;

    public static initializeDragCursor(event: DragEvent): Position {
        this.removeDragGhosting(event);
        return {
            x: event.screenX,
            y: event.screenY
        }
    }

    public static initializeDragTouch(event: TouchEvent): Position {
        const posX: number = Math.round(event.touches[0].screenX);
        const posY: number = Math.round(event.touches[0].screenY);
        return {
            x: posX,
            y: posY
        }
    }

    public static dragRotateCursor(event: MouseEvent, dragStartPos: Position, rotationInitialState: CubeMenuStates): CubeRotationState {
        const dragCurrentPos: Position = {
            x: event.screenX,
            y: event.screenY
        };
        return CubeRotationUtils.dragRotate(dragCurrentPos, dragStartPos, rotationInitialState)
    }

    public static dragRotateTouch(event: TouchEvent, dragStartPos: Position, rotationInitialState: CubeMenuStates): CubeRotationState {
        const posX: number = Math.round(event.touches[0].screenX);
        const posY: number = Math.round(event.touches[0].screenY);
        const dragCurrentPos: Position = {
            x: posX,
            y: posY
        };
        return CubeRotationUtils.dragRotate(dragCurrentPos, dragStartPos, rotationInitialState)
    }

    private static dragRotate(dragCurrentPos: Position, dragStartingPos: Position, rotationInitialState: CubeMenuStates): any {

        if (dragCurrentPos.x !== 0 && dragCurrentPos.y !==0) {
            const offsetCorrectionFromSection: Position = this.getOffsetCorrectionFromSection(rotationInitialState);
            const rotationOffset: Position = this.getActualRotationOffset(dragStartingPos, dragCurrentPos, offsetCorrectionFromSection);

            return {
                dragX: rotationOffset.x,
                dragY: rotationOffset.y,
                selectedMenuState: this.setSectionFromRotation(rotationOffset)
            };
        }
        return {};
    }

    static setSectionFromRotation(rotationOffset: Position): CubeMenuStates {
        let stateToSet = CubeMenuStates.NONE;
        if (rotationOffset.y <= this.SECTION_FREE_RANGE_DEG / -2) {
            stateToSet = CubeMenuStates.BOTTOM;
        } else if (rotationOffset.y >= this.SECTION_FREE_RANGE_DEG / 2) {
            if (rotationOffset.x <= this.SECTION_FREE_RANGE_DEG / -2) {
                stateToSet = CubeMenuStates.TOP_LEFT;
            } else if (rotationOffset.x > this.SECTION_FREE_RANGE_DEG / 2) {
                stateToSet = CubeMenuStates.TOP_RIGHT;
            }
        }
        return stateToSet;
    }

    static getActualRotationOffset(dragStartingPos: Position, dragCurrentPos: Position, offsetCorrectionFromSection: Position): Position {
        const smallerDimension = this.getSmallerDimension();
        const sesnsitivity = BrowserUtils.isMobile() ? this.ROTATION_SENSITIVITY_MOBILE : this.ROTATION_SENSITIVITY_DESKTOP;
        let horizontalDeg = this.validateMaxDegRotation(
            Math.round((dragStartingPos.x - dragCurrentPos.x) / (smallerDimension / (2 * sesnsitivity)) * 50) + offsetCorrectionFromSection.x);

        let verticalDeg = this.validateMaxDegRotation(
            Math.round((dragCurrentPos.y - dragStartingPos.y) / (smallerDimension / (2 * sesnsitivity)) * 50) + offsetCorrectionFromSection.y);

        horizontalDeg = horizontalDeg - horizontalDeg % 2;
        verticalDeg = verticalDeg - verticalDeg % 2;
        return {
            x: horizontalDeg, y: verticalDeg
        };
    }

    private static validateMaxDegRotation(degree: number): number {
        if (degree > this.CUBE_SIDE_ROTATION_DEG) {
            degree = this.CUBE_SIDE_ROTATION_DEG;
        } else if (degree < -this.CUBE_SIDE_ROTATION_DEG) {
            degree = -this.CUBE_SIDE_ROTATION_DEG;
        }

        return degree;
    }

    private static getOffsetCorrectionFromSection(rotationInitialState: CubeMenuStates): Position {
        const offset: Position = {
            x: 0, y: 0
        };
        switch (rotationInitialState) {
            case CubeMenuStates.TOP_LEFT:
                offset.x = -this.SECTION_INITIAL_DIFFERENCE_DEG;
                offset.y = this.SECTION_INITIAL_DIFFERENCE_DEG - this.SECTION_VERTICAL_OFFSET_DEG;
                break;
            case CubeMenuStates.TOP_RIGHT:
                offset.x = this.SECTION_INITIAL_DIFFERENCE_DEG;
                offset.y = this.SECTION_INITIAL_DIFFERENCE_DEG - this.SECTION_VERTICAL_OFFSET_DEG;
                break;
            case CubeMenuStates.BOTTOM:
                offset.y = -this.SECTION_INITIAL_DIFFERENCE_DEG - this.SECTION_VERTICAL_OFFSET_DEG;
                break;
        }

        return offset;
    }

    private static getSmallerDimension(): number {
        if (window.innerHeight < window.innerWidth) {
            return window.innerHeight
        } else {
            return window.innerWidth
        }
    }

    private static removeDragGhosting(event: DragEvent): void {
        // TODO: Find better solution for drag image
        var img = new Image();
        img.src = "";
        event.dataTransfer.setDragImage(img, 0, 0);
        event.dataTransfer.setData("text/plain", "");
    }
}