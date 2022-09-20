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
    selectedMenuState?: CubeMenuStates;
    rotationInitialState?: CubeMenuStates;
    menuDescription?: CubeMenuDescriptions;
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

enum CubeMenuDescriptions {
    CLIENT_APPROACH = "Client Approach is lorem ipsum, consectetur adipiscing elit. Ut tempus, purus vel accumsan interdum, metus leo tempor orci, eget gravida dolor lectus non velit. Vivamus cursus eros convallis, commodo felis consectetur, aliquet magna. Praesent tincidunt odio eu justo semper, vel porttitor ante convallis. Suspendisse luctus nisi id mollis auctor.",
    CHESS_DEMO = "Chess demo is lorem ipsum, consectetur adipiscing elit. Donec vel semper purus, at maximus mauris. Donec pharetra a mi in venenatis. Vestibulum non quam vitae velit congue luctus. Nam vestibulum justo eget mauris lacinia pellentesque. Etiam magna orci, lacinia non placerat interdum, blandit et metus. Nulla molestie turpis iaculis mauris dictum.",
    PAST_EXPERIENCE = "Past Experience is lorem ipsum. Aenean dapibus nisi id turpis fringilla, elementum egestas sem sagittis. Mauris congue, dui eu ultrices aliquet, ligula neque ultricies augue, eu mattis nisl turpis non risus. Sed sed magna posuere, ornare lorem sed, blandit sapien. Morbi efficitur est in eros faucibus aliquet, non sollicitudin orci venenatis sed."
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
            selectedMenuState: CubeMenuStates.NONE,
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

        setTimeout(() => {
            this.setState({cubeRotationClass: RotationStates.LEFT_ZOOM});
        }, 500);

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
        }, 3000);

        window.addEventListener("dragstart", this.getCoordinates.bind(this));
        window.addEventListener("drag", this.dragRotate.bind(this));
        window.addEventListener("dragend", this.dragReleaseSelect.bind(this));
    }

    componentDidUpdate(prevProps: LandingCubeProps, prevState: LandingCubeState) {
        // Typical usage (don't forget to compare props):
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
                this.setState({menuDescription: CubeMenuDescriptions.PAST_EXPERIENCE});
                break;
            case CubeMenuStates.TOP_LEFT:
                this.setState({menuDescription: CubeMenuDescriptions.CLIENT_APPROACH});
                break;
            case CubeMenuStates.BOTTOM:
                this.setState({menuDescription: CubeMenuDescriptions.CHESS_DEMO});
                break;
        }
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
            <div className={`text-bubble-wrapper bubble-wrapper ${this.state.cubeOpened ? "" : "disappear"}`}>
                <div className={"text-bubble bubble"}>
                    {this.state.cubeOpened &&
                        <Typewriter
                            textToType={"Hi. My name is Alex. I am web developer with a decade of experience in the field. With a focus in the past in front-end banking and web gaming solutions, I strive to deliver swift web apps with seamless interactiveness and impeccable security. Rotate the cube and select a page for more info. All code of this website is available in GIT, accessible is via the footer."}
                        />
                    }
                    <div className={"avatar-wrapper"}>
                        <div className={"avatar-icon"}></div>
                        <div className={"avatar-name"}>Alex</div>
                    </div>
                </div>
            </div>
            <div className={`menu-bubble-wrapper bubble-wrapper ${this.state.selectedMenuState === CubeMenuStates.NONE ? "disappear" : ""}`}>
                    <div className={"menu-bubble bubble"}>
                        <div className={"avatar-wrapper"}>
                            <div className={`avatar-icon ${this.state.selectedMenuState}`}></div>
                            <div className={"avatar-name"}>
                                {this.state.selectedMenuState === CubeMenuStates.TOP_LEFT && <span>Client Approach</span>}
                                {this.state.selectedMenuState === CubeMenuStates.TOP_RIGHT && <span>Past Experience</span>}
                                {this.state.selectedMenuState === CubeMenuStates.BOTTOM && <span>Chess Demo</span>}
                            </div>
                        </div>
                        <div className={"bubble-text"}>
                            {this.state.menuDescription}
                        </div>
                        <button className={"go-page"}>Launch Page</button>
                    </div>
            </div>
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
                                <div className={"wall-content"}></div>
                                <div className={"wall-label"}>
                                    Chess Demo
                                </div>
                            </div>
                            <div className={`wall wall-left ${this.state.selectedMenuState === CubeMenuStates.TOP_LEFT ? "selected" : ""}`}
                                 onClick={() => this.setState({rotationInitialState: CubeMenuStates.TOP_LEFT, selectedMenuState: CubeMenuStates.TOP_LEFT})}>
                                <div className={"wall-content"}></div>
                                <div className={"wall-label"}>
                                    Client Approach
                                </div>
                            </div>
                            <div className={`wall wall-right ${this.state.selectedMenuState === CubeMenuStates.TOP_RIGHT ? "selected" : ""}`}
                                 onClick={() => this.setState({rotationInitialState: CubeMenuStates.TOP_RIGHT, selectedMenuState: CubeMenuStates.TOP_RIGHT})}>
                                <div className={"wall-content"}></div>
                                <div className={"wall-label"}>
                                    Past Experience
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
