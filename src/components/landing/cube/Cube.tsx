import React from 'react';
import './Cube.scss';
import {CubeRotationStates} from "../../../models/landing/CubeRotationStates";
import {Position} from "../../../models/common/Position";
import {CubeMenuStates} from "../../../models/landing/CubeMenuStates";
import {LandingDescriptions} from "../../../labels/LandingLabels";
import {connect, useDispatch } from 'react-redux';
import {openCube} from "../../../utils/cubeAction";
import LandingPage from "../LandingPage";
import store from '../../../store/store';

interface LandingCubeProps {
    openCube?: any;
}

interface LandingCubeState {
    coveredCubeVisible?: boolean;
    cubeOpened?: boolean;
    cubeDragClass?: string;
    cubeRotationClass?: CubeRotationStates;
    selectedMenuState?: CubeMenuStates;
    rotationInitialState?: CubeMenuStates;
    menuDescription?: LandingDescriptions;
}

class Cube extends React.Component<LandingCubeProps, LandingCubeState> {
    private readonly CUBE_OPEN_TIME_MS = 1500;
    private readonly CUBE_SIDE_ROTATION_ANGLES = 50;
    private cubeRotationClass = CubeRotationStates.LEFT_ZOOM;
    private dragStartingPos: Position;

    constructor(props: LandingCubeProps) {
        super(props);

        this.state = {
            cubeOpened: false,
            coveredCubeVisible: true,
            cubeRotationClass: CubeRotationStates.NORMAL,
            selectedMenuState: CubeMenuStates.NONE,
            rotationInitialState: CubeMenuStates.NONE
        };

        this.dragStartingPos = {
            x: 0,
            y: 0
        }

        setTimeout(() => {
            this.setState({cubeRotationClass: CubeRotationStates.LEFT_ZOOM});
        });

        setInterval(() => {
            if (this.state.cubeRotationClass !== CubeRotationStates.NORMAL) {
                if (this.state.cubeRotationClass === CubeRotationStates.LEFT_ZOOM) {
                    this.cubeRotationClass = CubeRotationStates.RIGHT_ZOOM;
                } else {
                    this.cubeRotationClass = CubeRotationStates.LEFT_ZOOM;
                }
                this.setState({cubeRotationClass: CubeRotationStates.NORMAL});
            } else {
                this.setState({cubeRotationClass: this.cubeRotationClass});
            }
        }, 3000);

        window.addEventListener("dragstart", this.getCoordinates.bind(this));
        window.addEventListener("drag", this.dragRotate.bind(this));
        window.addEventListener("dragend", this.dragReleaseSelect.bind(this));
    }

    componentDidUpdate(prevProps: LandingCubeProps, prevState: LandingCubeState) {
        if (this.state.selectedMenuState !== prevState.selectedMenuState) {
            if (prevState.selectedMenuState === CubeMenuStates.NONE) {
                this.setDescription(this.state.selectedMenuState);
            } else {
                setTimeout(() => {
                    this.setDescription(this.state.selectedMenuState);
                }, 500)
            }
        }
    }

    setDescription(selectedMenu?: CubeMenuStates) {
        switch (this.state.selectedMenuState) {
            case CubeMenuStates.TOP_RIGHT:
                this.setState({menuDescription: LandingDescriptions.PAST_EXPERIENCE});
                break;
            case CubeMenuStates.TOP_LEFT:
                this.setState({menuDescription: LandingDescriptions.CLIENT_APPROACH});
                break;
            case CubeMenuStates.BOTTOM:
                this.setState({menuDescription: LandingDescriptions.CHESS_DEMO});
                break;
        }
    }

    getCoordinates(event: DragEvent): void {
        this.dragStartingPos = {
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
            if (window.screenX < window.screenY) {
                smallerDimension = window.screenX
            } else {
                smallerDimension = window.screenY
            }


            let horizontalDeg = Math.round((event.screenX - this.dragStartingPos.x) / (smallerDimension / 2) * 50) + offsetHor;

            if (horizontalDeg > this.CUBE_SIDE_ROTATION_ANGLES) {
                horizontalDeg = this.CUBE_SIDE_ROTATION_ANGLES;
            } else if (horizontalDeg < -this.CUBE_SIDE_ROTATION_ANGLES) {
                horizontalDeg = -this.CUBE_SIDE_ROTATION_ANGLES;
            }

            let verticalDeg = Math.round((this.dragStartingPos.y - event.screenY) / (smallerDimension / 2) * 50) + offsetVer;

            if (verticalDeg > (this.CUBE_SIDE_ROTATION_ANGLES)) {
                verticalDeg = (this.CUBE_SIDE_ROTATION_ANGLES);
            } else if (verticalDeg < -(this.CUBE_SIDE_ROTATION_ANGLES)) {
                verticalDeg = -(this.CUBE_SIDE_ROTATION_ANGLES);
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
                selectedMenuState: stateToSet
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
            rotationInitialState: this.state.selectedMenuState
        })
    }

    openFlower(): void {
        this.props.openCube();
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
        return (
        <>
            <div className="loading-element-wrapper">
                <div className={`flower-wrapper ${this.state.cubeOpened ? "opened" : ""}`}>
                    <div className={"flower"}></div>
                </div>
                <div className={"cube-core"}></div>
                <div draggable={this.state.cubeOpened} className={`cube-wrapper  ${this.state.cubeOpened ? "opened" : "closed"} ${this.state.cubeDragClass} ${this.state.cubeRotationClass} ${this.state.rotationInitialState}`} onClick={this.openFlower.bind(this)}>
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
                        <div className={`wall wall-bottom ${this.state.selectedMenuState === CubeMenuStates.BOTTOM ? "selected" : ""}`}
                             onClick={() => this.setState({rotationInitialState: CubeMenuStates.BOTTOM, selectedMenuState: CubeMenuStates.BOTTOM})}>
                            <div className={"wall-content"}>
                                <div className={"wall-icon"}></div>
                            </div>
                        </div>
                        <div className={`wall wall-left ${this.state.selectedMenuState === CubeMenuStates.TOP_LEFT ? "selected" : ""}`}
                             onClick={() => this.setState({rotationInitialState: CubeMenuStates.TOP_LEFT, selectedMenuState: CubeMenuStates.TOP_LEFT})}>
                            <div className={"wall-content"}>
                                <div className={"wall-icon"}></div>
                            </div>
                        </div>
                        <div className={`wall wall-right ${this.state.selectedMenuState === CubeMenuStates.TOP_RIGHT ? "selected" : ""}`}
                             onClick={() => this.setState({rotationInitialState: CubeMenuStates.TOP_RIGHT, selectedMenuState: CubeMenuStates.TOP_RIGHT})}>
                            <div className={"wall-content"}>
                                <div className={"wall-icon"}></div>
                            </div>
                        </div>
                    </>
                </div>
            </div>
        </>
        )
    }
}

export default connect(null, { openCube })(Cube);
