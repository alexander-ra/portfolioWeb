import {Position} from "../models/common/Position";
import {ContentPageState} from "../components/contentPage/ContentPage";
import {CircleMenuStates} from "../models/landing/CircleMenuStates";

export class CircleRotationUtils {
    private static readonly CUBE_SIDE_ROTATION_DEG = 50;

    public static initializeDragCursor(event: DragEvent): Position {
        this.removeDragGhosting(event);
        return {
            x: event.x,
            y: event.y
        }
    }

    public static initializeDragTouch(event: TouchEvent): Position {
        const posX: number = Math.round(event.touches[0].clientX);
        const posY: number = Math.round(event.touches[0].clientY);
        return {
            x: posX,
            y: posY
        }
    }

    public static dragRotateCursor(event: DragEvent, dragStartPos: Position, circleOffsetDegrees: number): any {
        const dragCurrentPos: Position = {
            x: event.x,
            y: event.y
        };
        if (event.x === 0 && event.y === 0) {
        } else {
            return CircleRotationUtils.dragRotate(dragCurrentPos, dragStartPos, circleOffsetDegrees)
        }
    }

    public static dragRotateTouch(event: TouchEvent, dragStartPos: Position, circleOffsetDegrees: number): ContentPageState {
        const posX: number = Math.round(event.touches[0].clientX);
        const posY: number = Math.round(event.touches[0].clientY);
        const dragCurrentPos: Position = {
            x: posX,
            y: posY
        };
        return CircleRotationUtils.dragRotate(dragCurrentPos, dragStartPos, circleOffsetDegrees)
    }

    private static dragRotate(dragCurrentPos: Position, dragStartingPos: Position, initialCircleOffsetDegrees: number): any {

        if (dragCurrentPos.x !== 0 && dragCurrentPos.y !==0) {
            const rotationOffset: number = this.getActualRotationOffset(dragStartingPos, dragCurrentPos, initialCircleOffsetDegrees);

            return {
                actualCircleOffsetDegrees: rotationOffset,
                dragInitiated: true,
            };
        }
        return {};
    }

    static getActualRotationOffset(dragStartingPos: Position, dragCurrentPos: Position, circleOffsetDegrees: number): number {
        const screenCenter = this.getScreenCenter();
        const P1 = screenCenter;
        const P2 = dragCurrentPos;
        const P3 = dragStartingPos;

        const atanStart = Math.atan2(P3.y - P1.y, P3.x - P1.x) * 180 / Math.PI;
        const atanCur = Math.atan2(P2.y - P1.y, P2.x - P1.x) * 180 / Math.PI;
        const angleCalc = atanCur - atanStart;
        let result = (angleCalc + circleOffsetDegrees) % 360;
        if (result < 0) {
            result += 360;
        }
        return Math.round(result);
    }

    private static validateMaxDegRotation(degree: number): number {
        if (degree > this.CUBE_SIDE_ROTATION_DEG) {
            degree = this.CUBE_SIDE_ROTATION_DEG;
        } else if (degree < -this.CUBE_SIDE_ROTATION_DEG) {
            degree = -this.CUBE_SIDE_ROTATION_DEG;
        }

        return degree;
    }

    private static getScreenCenter(): Position {
        return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        }
    }

    private static removeDragGhosting(event: Event): void {
        // TODO: Find better solution for drag image
        var img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

        // @ts-ignore
        event.dataTransfer.setDragImage(img, 0, 0);
    }
}