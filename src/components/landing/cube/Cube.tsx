import React from 'react';
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
import {faChess, faChessKnight, faHandshake, faSuitcase} from '@fortawesome/free-solid-svg-icons';

interface CubeProps {
    openCube?: any;
    selectMenu?: any;
    devIntroCompleted?: boolean;
    isCLosing: boolean;
    firstTimeLanding?: boolean;
}

export interface CubeRotationState {
    cubeDragClass?: string;
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
    private cubeRotationClass = CubeRotationStates.LEFT_ZOOM;
    private dragStartingPos: Position;
    private dragInitiated: boolean = false;

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
            rotationInitialState: CubeMenuStates.NONE
        };

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
        }, this.CLOSED_CUBE_AUTO_ROTATION_TIME_MS);
    }
    addCubeRotationListeners() {
        window.addEventListener("dragstart", (event) => {
            this.dragStartingPos = CubeRotationUtils.initializeDragCursor(event);
        });
        window.addEventListener("drag", (event) => {
            this.dragInitiated = true;
            const newState = CubeRotationUtils.dragRotateCursor(event, this.dragStartingPos, this.state.rotationInitialState);
            if (newState.selectedMenuState !== this.state.selectedMenuState || newState.cubeDragClass !== this.state.cubeDragClass) {
                this.setState(newState);
            }
        });
        window.addEventListener("dragend", () => {
            this.setState({
                cubeDragClass: "",
                rotationInitialState: this.state.selectedMenuState
            })
        });
        window.addEventListener("touchstart", (event) => {
            this.dragStartingPos = CubeRotationUtils.initializeDragTouch(event);
        });
        window.addEventListener("touchmove", (event) => {
            this.dragInitiated = true;
            const newState = CubeRotationUtils.dragRotateTouch(event, this.dragStartingPos, this.state.rotationInitialState);
            if (newState.selectedMenuState !== this.state.selectedMenuState || newState.cubeDragClass !== this.state.cubeDragClass) {
                this.setState(newState);
            }
        });
        window.addEventListener("touchend", () => {
            this.setState({
                cubeDragClass: "",
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
        return Boolean(this.state.cubeOpened && !this.dragInitiated && this.props.firstTimeLanding &&
            this.props.devIntroCompleted && this.state.selectedMenuState === CubeMenuStates.NONE);
    }

    render(){
        return (
            <div className="loading-element-wrapper">
                {this.shouldDisplayRotationHint() && <div className={`rotate-hint-icon`}/>}
                <Flower isClosing={this.props.isCLosing} flowerVisible={this.state.cubeOpened} />
                <div draggable={this.state.cubeOpened}
                     className={`cube-wrapper  ${this.state.cubeOpened ? (this.props.isCLosing ? "closing" : "opened") : "closed"} ${this.state.cubeDragClass} ${this.state.cubeRotationClass} ${this.state.rotationInitialState}`}
                     onClick={this.openCube.bind(this)}>
                    {this.state.cubeCoverVisible && <CubeCover />}
                    <>
                        <CubeWall menu={CubeMenuStates.BOTTOM}
                                  selected={this.state.selectedMenuState === CubeMenuStates.BOTTOM}
                                  onSelect={this.selectMenu.bind(this)}
                                  icon={faChess}/>
                        <CubeWall menu={CubeMenuStates.TOP_LEFT}
                                  selected={this.state.selectedMenuState === CubeMenuStates.TOP_LEFT}
                                  onSelect={this.selectMenu.bind(this)}
                                  icon={faHandshake}/>
                        <CubeWall menu={CubeMenuStates.TOP_RIGHT}
                                  selected={this.state.selectedMenuState === CubeMenuStates.TOP_RIGHT}
                                  onSelect={this.selectMenu.bind(this)}
                                  icon={faSuitcase}/>
                    </>
                </div>
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

