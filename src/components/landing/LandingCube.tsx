import React from 'react';
import './LandingCube.scss';
import Typewriter from "../utils/Typewriter";

interface LandingCubeProps {
}

interface LandingCubeState {
    coveredCubeVisible?: boolean;
    cubeOpened?: boolean;
    cubeDragClass?: string;
    cubeRotationClass?: RotationStates;
    cubeMenuState?: CubeMenuStates;
    rotationInitialState?: CubeMenuStates;
}

interface Position {
    x: number;
    y: number;
}

enum RotationStates {
    NORMAL = "NORMAL",
    LEFT_ZOOM = "LEFT_ZOOM",
    RIGHT_ZOOM = "RIGHT_ZOOM"
}

enum CubeMenuStates {
    NONE = "NONE",
    TOP_LEFT = "TOP_LEFT",
    TOP_RIGHT = "TOP_RIGHT",
    BOTTOM = "BOTTOM"
}

class LandingCube extends React.Component<LandingCubeProps, LandingCubeState> {
    private CUBE_OPEN_TIME_MS = 1500;
    private horDegMax = 50;
    private verDegMax = 50;
    private nextRotationClass = RotationStates.LEFT_ZOOM;
    private dragStart: Position;
    private dimensions: Position;
    constructor(props: LandingCubeProps) {
        super(props);

        this.state = {
            cubeOpened: false,
            coveredCubeVisible: true,
            cubeRotationClass: RotationStates.NORMAL,
            cubeMenuState: CubeMenuStates.NONE,
            rotationInitialState: CubeMenuStates.NONE
        };

        this.dragStart = {
            x: 0,
            y: 0
        }

        this.dimensions = {
            x: window.screenX,
            y: window.screenY
        }

        this.setState({cubeRotationClass: RotationStates.LEFT_ZOOM});

        setInterval(() => {
            if (this.state.cubeRotationClass !== RotationStates.NORMAL) {
                if (this.state.cubeRotationClass === RotationStates.LEFT_ZOOM) {
                    this.nextRotationClass = RotationStates.RIGHT_ZOOM;
                } else {
                    this.nextRotationClass = RotationStates.LEFT_ZOOM;
                }
                this.setState({cubeRotationClass: RotationStates.NORMAL});
            } else {
                this.setState({cubeRotationClass: this.nextRotationClass});
            }
        }, 5000);

        window.addEventListener("dragstart", this.getCoordinates.bind(this));
        window.addEventListener("drag", this.dragRotate.bind(this));
        window.addEventListener("dragend", this.dragReleaseSelect.bind(this));
    }

    getCoordinates(event: DragEvent): void {
        this.dragStart = {
            x: event.screenX,
            y: event.screenY
        }
        var img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

        // @ts-ignore
        event.dataTransfer.setDragImage(img, 0, 0);
    }

    dragRotate(event: DragEvent): void {
        if (event.screenX !== 0 && event.screenY !==0) {
            let offsetHor = 0;
            let offsetVer = 0;
            switch (this.state.rotationInitialState) {
                case CubeMenuStates.TOP_LEFT:
                    offsetHor = -35;
                    offsetVer = 27;
                    break;
                case CubeMenuStates.TOP_RIGHT:
                    offsetHor = 35;
                    offsetVer = 27;
                    break;
                case CubeMenuStates.BOTTOM:
                    offsetVer = -43;

            }


            let smallerDimension;
            if (this.dimensions.x < this.dimensions.y) {
                smallerDimension = this.dimensions.x
            } else {
                smallerDimension = this.dimensions.y
            }


            let horizontalDeg = Math.round((event.screenX - this.dragStart.x) / (smallerDimension / 2) * 50) + offsetHor;

            if (horizontalDeg > this.horDegMax) {
                horizontalDeg = this.horDegMax;
            } else if (horizontalDeg < -this.horDegMax) {
                horizontalDeg = -this.horDegMax;
            }

            let verticalDeg = Math.round((this.dragStart.y - event.screenY) / (smallerDimension / 2) * 50) + offsetVer;

            if (verticalDeg > (this.verDegMax)) {
                verticalDeg = (this.verDegMax);
            } else if (verticalDeg < -(this.verDegMax)) {
                verticalDeg = -(this.verDegMax);
            }

            let stateToSet = CubeMenuStates.NONE;

            if (verticalDeg <= -25) {
                stateToSet = CubeMenuStates.BOTTOM;
            } else if (verticalDeg >= 15) {
                if (horizontalDeg <= -20) {
                    stateToSet = CubeMenuStates.TOP_LEFT;
                } else if (horizontalDeg > 20) {
                    stateToSet = CubeMenuStates.TOP_RIGHT;
                }
            }

            this.setState({
                cubeDragClass: `rotidx${verticalDeg}degy${horizontalDeg}deg`,
                cubeMenuState: stateToSet
            })
        }

        var img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

        // @ts-ignore
        event.dataTransfer.setDragImage(img, 0, 0);
    }

    dragReleaseSelect(event: DragEvent): void {
        this.setState({
            cubeDragClass: "",
            rotationInitialState: this.state.cubeMenuState
        })
    }

    openFlower(): void {
        this.setState({
            cubeOpened: true
        })
        setTimeout(() =>
            this.setState({
                coveredCubeVisible: false
            })
            , this.CUBE_OPEN_TIME_MS);
    }


    render(){
        return (<>
            <div className="loading-element-wrapper">
                    <div className={`flower-wrapper ${this.state.cubeOpened ? "opened" : ""}`}>
                        <div className={"flower"}></div>
                    </div>
                    {this.state.cubeOpened && <div className={"title-text"}>
                        <Typewriter />
                    </div>}
                    <div className={"cube-core"}></div>
                    <div draggable="true" className={`cube-wrapper  ${this.state.cubeOpened ? "opened" : "closed"} ${this.state.cubeDragClass} ${this.state.cubeRotationClass} ${this.state.rotationInitialState}`} onClick={this.openFlower.bind(this)}>
                        {this.state.coveredCubeVisible && <>
                            <div  className={"wall-initial wall-bottom-initial"}>
                                <div className={"wall-inside-wrapper"}>
                                    <div className={"wall-inside"}>
                                    </div>
                                    <div className={"wall-inside-under-wrapper"}>
                                        <div className={"wall-inside-under"}>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"wall-initial wall-left-initial"}>
                                <div className={"wall-inside-wrapper"}>
                                    <div className={"wall-inside"}>
                                    </div>
                                    <div className={"wall-inside-under-wrapper"}>
                                        <div className={"wall-inside-under"}>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"wall-initial wall-right-initial"}>
                                <div className={"wall-inside-wrapper"}>
                                    <div className={"wall-inside"}>
                                    </div>
                                    <div className={"wall-inside-under-wrapper"}>
                                        <div className={"wall-inside-under"}>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>}
                        <>
                            <div className={`wall wall-bottom ${this.state.cubeMenuState === CubeMenuStates.BOTTOM ? "selected" : ""}`}>
                                <div className={"wall-content"}>
                                    <div className={"wall-icon"}></div>
                                </div>
                                <div className={"wall-label"}>
                                    Past Experience
                                </div>
                            </div>
                            <div className={`wall wall-left ${this.state.cubeMenuState === CubeMenuStates.TOP_LEFT ? "selected" : ""}`}>
                                <div className={"wall-content"}>
                                    <div className={"wall-icon"}></div>
                                </div>
                                <div className={"wall-label"}>
                                    Client Approach
                                </div>
                            </div>
                            <div className={`wall wall-right ${this.state.cubeMenuState === CubeMenuStates.TOP_RIGHT ? "selected" : ""}`}>
                                <div className={"wall-content"}>
                                    <div className={"wall-icon"}></div>
                                </div>
                                <div className={"wall-label"}>
                                    Play Chess Demo
                                </div>
                            </div>
                        </>
                    </div>
                </div>
        </>
        )
    }
}

export default LandingCube;
