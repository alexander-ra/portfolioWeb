import React, {CSSProperties} from 'react';
import './Cube.scss';
import {CubeRotationStates} from "../../../models/landing/CubeRotationStates";
import {Position} from "../../../models/common/Position";
import {CubeMenuStates} from "../../../models/landing/CubeMenuStates";
import {connect} from 'react-redux';
import {openCube, selectMenu} from "../../../reducers/cube/cubeAction";
import {CubeRotationUtils} from "../../../utils/CubeRotationUtils";
import Flower from "../Flower/Flower";
import CubeCover from "./CubeCover/CubeCover";
import CubeWall from "./CubeWall/CubeWall";
import { IconType } from '../../../models/common/IconType';
import Utils from '../../../utils/Utils';
import { CommonLabels } from '../../../provision/CommonLabels';

interface CubeProps {
    openCube?: any;
    selectMenu?: any;
    devIntroCompleted?: boolean;
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
    private autoRotationInterval: any;
    private cubeRotationClass = CubeRotationStates.LEFT_ZOOM;
    private dragStartingPos: Position;
    private dragInitiated: boolean = false;
    private lastDrag = 0;
    private showRotatingIndicator: boolean = true;

    constructor(props: CubeProps) {
        super(props);

        this.dragStartingPos = {
            x: 0,
            y: 0
        }

        this.state = {
            cubeOpened: !this.props.firstTimeLanding,
            cubeCoverVisible: this.props.firstTimeLanding,
            cubeRotationClass: CubeRotationStates.NORMAL,
            selectedMenuState: CubeMenuStates.NONE,
            rotationInitialState: CubeMenuStates.NONE,
            dragX: 0,
            dragY: 0
        };
    }

    componentDidMount() {
        this.setInitialValues();
        this.addCubeRotationListeners();
    }

    componentWillUnmount() {
        console.log("Cube unmount");
        clearInterval(this.autoRotationInterval);
        this.removeCubeRotationListeners();
    }

    componentDidUpdate(prevProps: Readonly<CubeProps>, prevState: Readonly<CubeState>, snapshot?: any) {
        if (prevState.selectedMenuState !== this.state.selectedMenuState) {
            console.log("componentDidUpdate", this.state.selectedMenuState);
            this.props.selectMenu(this.state.selectedMenuState);
        }
    }

    setInitialValues() {
        if (!this.props.firstTimeLanding) {
            setTimeout(() => {
                this.setState({cubeRotationClass: CubeRotationStates.LEFT_ZOOM});
                this.autoRotationInterval = setInterval(() => {
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
    }


    dragStart = (event: any) => {
        console.log("Cube drag start");
        this.dragStartingPos = CubeRotationUtils.initializeDragCursor(event);
        event.preventDefault();
        window.onmousemove = (event) => {
            this.dragInitiated = true;
            this.showRotatingIndicator = false;
            const newState = CubeRotationUtils.dragRotateCursor(event, this.dragStartingPos, this.state.rotationInitialState);
            if (newState.selectedMenuState !== this.state.selectedMenuState || newState.dragX !== this.state.dragX || newState.dragY !== this.state.dragY) {
                this.setState(newState);
            }

            window.onmouseup = () => {
                console.log("Cube drag end");
                event.preventDefault();
                window.onmousemove = null;
                window.onmouseup = null;
                this.setState({
                    dragX: 0,
                    dragY: 0,
                    rotationInitialState: this.state.selectedMenuState
                })
                this.dragInitiated = false;
                this.lastDrag = Date.now();
            }
        }
    }

    dragStartTouch = (event: any) => {
        console.log("Cube drag start touch");
        this.dragStartingPos = CubeRotationUtils.initializeDragTouch(event);
        event.preventDefault();
        document.ontouchmove = (event) => {
            this.dragInitiated = true;
            this.showRotatingIndicator = false;
            const newState = CubeRotationUtils.dragRotateTouch(event, this.dragStartingPos, this.state.rotationInitialState);
            if (newState.selectedMenuState !== this.state.selectedMenuState || newState.dragX !== this.state.dragX || newState.dragY !== this.state.dragY) {
                this.setState(newState);
            }

            document.ontouchend = () => {
                console.log("Cube drag end touch");
                event.preventDefault();
                document.onmousemove = null;
                document.onmouseup = null;
                this.dragInitiated = false;
                this.lastDrag = Date.now();
                this.setState({
                    dragX: 0,
                    dragY: 0,
                    rotationInitialState: this.state.selectedMenuState
                })
                setTimeout(() => {
                    this.dragInitiated = false;
                }, 100);
            }
        }
    }

    addCubeRotationListeners() {
        window.addEventListener("dragstart", this.dragStart);
        window.addEventListener("touchstart", this.dragStartTouch);
    }

    removeCubeRotationListeners() {
        window.removeEventListener("dragstart", this.dragStart);
        window.removeEventListener("touchstart", this.dragStartTouch);
        document.ontouchmove = null;
        document.ontouchend = null;
        window.onmousemove = null;
        window.onmouseup = null;
    }

    openCube(): void {
        if (Utils.isNotNull(this.autoRotationInterval)) {
            clearInterval(this.autoRotationInterval);
        }
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
        if (this.state.cubeOpened && !this.dragInitiated && Date.now() - this.lastDrag > 500) {
            this.props.selectMenu(menu);
            this.setState({rotationInitialState: menu, selectedMenuState: menu});
        }
    }

    shouldDisplayRotationHint(): boolean {
        return Boolean(this.state.cubeOpened && this.showRotatingIndicator && this.props.firstTimeLanding &&
            this.props.devIntroCompleted && this.state.selectedMenuState === CubeMenuStates.NONE);
    }

    getCubeAdditionalClasses(): string {
        let additionalClass = "";

        if (this.state.cubeOpened) {
            additionalClass = additionalClass.concat(" opened");
        } else {
            additionalClass = additionalClass.concat(" closed");
        }

        if (Utils.isNotNull(this.state.cubeRotationClass)) {
            additionalClass = additionalClass.concat(` ${this.state.cubeRotationClass}`);
        }

        if (Utils.isNotNull(this.state.rotationInitialState)) {
            additionalClass = additionalClass.concat(` ${this.state.rotationInitialState}`);
        }

        if (Utils.isNotNull(this.props.isLoading) && !this.props.isLoading) {
            additionalClass = additionalClass.concat(" loaded");
        }

        return additionalClass;
    }

    getCubeStyle(): React.CSSProperties {
        if (this.dragInitiated) {
            return {
                transform: `scale(1) rotateX(calc(37deg - ${this.state.dragY}deg)) rotateY(calc(-45deg - ${this.state.dragX}deg)) rotateZ(0deg)`
            }
        } else {
            return {};
        }
    }


    render(){
        return (
            <div className="loading-element-wrapper">
                {this.shouldDisplayRotationHint() && <div className={`rotate-hint-icon`}/>}
                <Flower flowerVisible={this.state.cubeOpened} />
                <div draggable={this.state.cubeOpened}
                     style={this.getCubeStyle()}
                     className={`cube-wrapper ${this.getCubeAdditionalClasses()}`}
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
                        {this.props.isLoading && <div className={"starting-text loading-text"}>
                            {CommonLabels.LOADING}
                        </div>}
                        {!this.props.isLoading && <div className={"starting-text ready-text"}>
                            {CommonLabels.READY}
                        </div>}
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

