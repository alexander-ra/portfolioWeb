import React from 'react';
import './Cube.scss';
import {CubeRotationStates} from "../../../models/landing/CubeRotationStates";
import {Position} from "../../../models/common/Position";
import {CubeMenuStates} from "../../../models/landing/CubeMenuStates";
import {connect} from 'react-redux';
import {openCube, selectMenu} from "../../../utils/cubeAction";
import {CubeRotationUtils} from "../../../utils/CubeRotationUtils";
import Flower from "./Flower/Flower";
import CubeCover from "./CubeCover";
import CubeWall from "./CubeWall";
import { faSuitcase, faChessKnight, faHandshake } from '@fortawesome/free-solid-svg-icons';

interface CubeProps {
    openCube?: any;
    selectMenu?: any;
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
        }
    }

    setInitialValues() {
        this.state = {
            cubeOpened: false,
            cubeCoverVisible: true,
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


    render(){
        return (
        <>
            <div className="loading-element-wrapper">
                <Flower flowerVisible={this.state.cubeOpened} />
                <div draggable={this.state.cubeOpened}
                     className={`cube-wrapper  ${this.state.cubeOpened ? "opened" : "closed"} ${this.state.cubeDragClass} ${this.state.cubeRotationClass} ${this.state.rotationInitialState}`}
                     onClick={this.openCube.bind(this)}>
                    {this.state.cubeCoverVisible && <CubeCover />}
                    <>
                        <CubeWall menu={CubeMenuStates.BOTTOM}
                                  selected={this.state.selectedMenuState === CubeMenuStates.BOTTOM}
                                  onSelect={this.selectMenu.bind(this)}
                                  icon={faChessKnight}/>
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
        </>
        )
    }
}

export default connect(null, { openCube, selectMenu })(Cube);
