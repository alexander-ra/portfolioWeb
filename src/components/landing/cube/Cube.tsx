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
import { CubeRotationState } from '../../../models/landing/CubeRotationState';
import BrowserUtils from "../../../utils/BrowserUtils";

interface CubeProps {
    openCube?: any;
    selectMenu?: any;
    devIntroCompleted?: boolean;
    firstTimeLanding?: boolean;
    isLoading: boolean;
}

interface CubeState extends CubeRotationState{
    cubeCoverVisible?: boolean;
    cubeOpened?: boolean;
    cubeRotationClass?: CubeRotationStates;
    rotationInitialState: CubeMenuStates;
}

/**
 * Cube component. This component is responsible for displaying the cube and keep track of the selected menu.
 *
 * @author Alexander Andreev
 */
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
    private cubeRef: React.RefObject<HTMLDivElement>;

    constructor(props: CubeProps) {
        super(props);
        this.cubeRef = React.createRef();

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
        clearInterval(this.autoRotationInterval);
        this.removeCubeRotationListeners();
    }

    componentDidUpdate(prevProps: Readonly<CubeProps>, prevState: Readonly<CubeState>, snapshot?: any) {
        if (prevState.selectedMenuState !== this.state.selectedMenuState) {
            this.props.selectMenu(this.state.selectedMenuState);
        }
    }

    setInitialValues() {
        if (!this.props.firstTimeLanding || !this.state.cubeOpened) {
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

    clickTouch = (event: any) => {
        console.log('click touch');
        document.ontouchmove = null;
        document.ontouchend = null;
    }

    dragStartTouch = (event: TouchEvent) => {
        this.lastDrag = Date.now();
        console.log(event.target);
        this.dragStartingPos = CubeRotationUtils.initializeDragTouch(event);
        event.preventDefault();

        this.cubeRef.current.ontouchmove = (event) => {
            this.dragInitiated = true;
            this.showRotatingIndicator = false;
            const newState = CubeRotationUtils.dragRotateTouch(event, this.dragStartingPos, this.state.rotationInitialState);
            if (newState.selectedMenuState !== this.state.selectedMenuState || newState.dragX !== this.state.dragX || newState.dragY !== this.state.dragY) {
                this.setState(newState);
            }

            this.cubeRef.current.ontouchend = () => {
                event.preventDefault();
                this.cubeRef.current.ontouchmove = null;
                this.cubeRef.current.ontouchend = null;
                this.dragInitiated = false;
                if (this.lastDrag + 250 > Date.now()) {
                    this.lastDrag = 0;
                } else {
                    this.lastDrag = Date.now();
                }
                this.setState({
                    dragX: 0,
                    dragY: 0,
                    rotationInitialState: this.state.selectedMenuState
                })
                this.dragInitiated = false;
            }
        }
    }

    addCubeRotationListeners() {
        if (BrowserUtils.isMobile()) {
            this.cubeRef.current.addEventListener("touchstart", this.dragStartTouch);
            this.cubeRef.current.addEventListener("click", this.clickTouch);
        } else {
            this.cubeRef.current.addEventListener("dragstart", this.dragStart);
        }
    }

    removeCubeRotationListeners() {
        this.cubeRef.current.removeEventListener("dragstart", this.dragStart);
        this.cubeRef.current.removeEventListener("touchstart", this.dragStartTouch);
        this.cubeRef.current.ontouchmove = null;
        this.cubeRef.current.ontouchend = null;
        window.onmousemove = null;
        window.onmouseup = null;
    }

    openCube(): void {
        if (!this.props.isLoading) {
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
    }

    selectMenu(menu: CubeMenuStates): void {
        if (this.state.cubeOpened && !this.state.cubeCoverVisible && Date.now() - this.lastDrag > 100) {
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
                     onClick={this.openCube.bind(this)}
                     onTouchStart={this.openCube.bind(this)}
                     ref={this.cubeRef}>
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

