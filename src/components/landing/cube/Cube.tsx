import React, {CSSProperties} from 'react';
import './Cube.scss';
import {CubeRotationStates} from "../../../models/landing/CubeRotationStates";
import {Position} from "../../../models/common/Position";
import {CubeMenuStates} from "../../../models/landing/CubeMenuStates";
import {connect} from 'react-redux';
import {openCube, selectMenu} from "../../../reducers/cube/cubeAction";
import {CubeRotationUtils} from "../../../utils/CubeRotationUtils";
import Flower from "./Flower/Flower";
import CubeCover from "./CubeCover";
import CubeWall from "./CubeWall";
import { IconType } from '../../common/icon/IconType';

interface CubeProps {
    openCube?: any;
    selectMenu?: any;
    devIntroCompleted?: boolean;
    isCLosing: boolean;
    firstTimeLanding?: boolean;
    isLoading: boolean;
}

export interface CubeRotationState {
    dragX?: number;
    dragY: number;
    selectedMenuState: CubeMenuStates;
}

interface CubeState extends CubeRotationState{
    cubeCoverVisible?: boolean;
    cubeOpened?: boolean;
    cubeRotationClass?: CubeRotationStates;
    rotationInitialState: CubeMenuStates;
}

class Cube extends React.Component<CubeProps, CubeState> {
    private readonly CUBE_OPEN_TIME_MS = 2000;
    private readonly CLOSED_CUBE_AUTO_ROTATION_TIME_MS = 3000;
    private readonly CUBE_INITIAL_AUTO_ROTATION_DELAY_MS = 1000;
    private cubeRotationClass = CubeRotationStates.LEFT_ZOOM;
    private dragStartingPos: Position;
    private dragInitiated: boolean = false;
    private showRotatingIndicator: boolean = true;

    constructor(props: CubeProps) {
        super(props);

        this.dragStartingPos = {
            x: 0,
            y: 0
        }
        this.setInitialValues();
        this.addCubeRotationListeners();
    }

    componentDidUpdate(prevProps: Readonly<CubeProps>, prevState: Readonly<CubeState>, snapshot?: any) {
        if (prevState.selectedMenuState !== this.state.selectedMenuState) {
            this.props.selectMenu(this.state.selectedMenuState);
        } else if (prevProps.isCLosing !== this.props.isCLosing && this.props.isCLosing) {
            this.setState({selectedMenuState: CubeMenuStates.NONE});
        }
    }

    setInitialValues() {
        this.state = {
            cubeOpened: !this.props.firstTimeLanding,
            cubeCoverVisible: this.props.firstTimeLanding,
            cubeRotationClass: CubeRotationStates.NORMAL,
            selectedMenuState: CubeMenuStates.NONE,
            rotationInitialState: CubeMenuStates.NONE,
            dragX: 0,
            dragY: 0
        };

        setTimeout(() => {
            this.setState({cubeRotationClass: CubeRotationStates.LEFT_ZOOM});
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
            }, this.CLOSED_CUBE_AUTO_ROTATION_TIME_MS);
        }, this.CUBE_INITIAL_AUTO_ROTATION_DELAY_MS);
    }
    addCubeRotationListeners() {
        window.addEventListener("dragstart", (event) => {
            this.dragStartingPos = CubeRotationUtils.initializeDragCursor(event);

        });
        window.addEventListener("drag", (event) => {
            this.dragInitiated = true;
            this.showRotatingIndicator = false;
            const newState = CubeRotationUtils.dragRotateCursor(event, this.dragStartingPos, this.state.rotationInitialState);
            if (newState.selectedMenuState !== this.state.selectedMenuState || newState.dragX !== this.state.dragX || newState.dragY !== this.state.dragY) {
                this.setState(newState);
            }
        });
        window.addEventListener("dragend", () => {
            this.setState({
                dragX: 0,
                dragY: 0,
                rotationInitialState: this.state.selectedMenuState
            })
            this.dragInitiated = false;
        });
        window.addEventListener("touchstart", (event) => {
            this.dragStartingPos = CubeRotationUtils.initializeDragTouch(event);
        });
        window.addEventListener("touchmove", (event) => {
            this.dragInitiated = true;
            this.showRotatingIndicator = false;
            const newState = CubeRotationUtils.dragRotateTouch(event, this.dragStartingPos, this.state.rotationInitialState);
            if (newState.selectedMenuState !== this.state.selectedMenuState || newState.dragX !== this.state.dragX || newState.dragY !== this.state.dragY) {
                this.setState(newState);
            }
        });
        window.addEventListener("touchend", () => {
            this.dragInitiated = false;
            this.setState({
                dragX: 0,
                dragY: 0,
                rotationInitialState: this.state.selectedMenuState
            })
        });
    }

    openCube(): void {
        this.props.openCube();
        this.setState({
            cubeOpened: true
        })
        setTimeout(() =>
            this.setState({
                cubeCoverVisible: false
            })
            , this.CUBE_OPEN_TIME_MS);
    }

    selectMenu(menu: CubeMenuStates): void {
        this.props.selectMenu(menu);
        this.setState({rotationInitialState: menu, selectedMenuState: menu});
    }

    shouldDisplayRotationHint(): boolean {
        return Boolean(this.state.cubeOpened && this.showRotatingIndicator && this.props.firstTimeLanding &&
            this.props.devIntroCompleted && this.state.selectedMenuState === CubeMenuStates.NONE);
    }

    render(){
        return (
            <div className="loading-element-wrapper">
                {this.shouldDisplayRotationHint() && <div className={`rotate-hint-icon`}/>}
                <Flower isClosing={this.props.isCLosing} flowerVisible={this.state.cubeOpened} />
                <div draggable={this.state.cubeOpened}
                     style={this.dragInitiated ? {
                         transform: `scale(1) rotateX(calc(37deg - ${this.state.dragY}deg)) rotateY(calc(-45deg - ${this.state.dragX}deg)) rotateZ(0deg)`
                } : null}
                     className={`cube-wrapper  ${this.state.cubeOpened ? (this.props.isCLosing ? "closing" : "opened") : "closed"} ${this.state.cubeRotationClass} ${this.state.rotationInitialState} ${this.props.isLoading ? "" : "loaded"}`}
                     onClick={this.openCube.bind(this)}>
                    {this.state.cubeCoverVisible && <CubeCover />}
                    <>
                        <CubeWall menu={CubeMenuStates.BOTTOM}
                                  selected={this.state.selectedMenuState === CubeMenuStates.BOTTOM}
                                  onSelect={this.selectMenu.bind(this)}
                                  icon={IconType.faChess}/>
                        <CubeWall menu={CubeMenuStates.TOP_LEFT}
                                  selected={this.state.selectedMenuState === CubeMenuStates.TOP_LEFT}
                                  onSelect={this.selectMenu.bind(this)}
                                  icon={IconType.faHandshake}/>
                        <CubeWall menu={CubeMenuStates.TOP_RIGHT}
                                  selected={this.state.selectedMenuState === CubeMenuStates.TOP_RIGHT}
                                  onSelect={this.selectMenu.bind(this)}
                                  icon={IconType.faSuitcase}/>
                    </>
                </div>
                { !this.state.cubeOpened &&
                    <>
                        {this.props.isLoading && <div className={"starting-text loading-text"}>Loading...</div>}
                        {!this.props.isLoading && <div className={"starting-text ready-text"}>Ready!</div>}
                    </>
                }
            </div>
        )
    }
}

export default connect((state: any, ownProps) => {
    const { devIntroCompleted, landingPageLeft } = state.stagesReducer;
    return {
        ...ownProps,
        devIntroCompleted,
        firstTimeLanding: !landingPageLeft
    }
}, { openCube, selectMenu })(Cube);

