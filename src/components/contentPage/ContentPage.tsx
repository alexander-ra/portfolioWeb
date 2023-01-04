import React from 'react';
import './ContentPage.scss';
import {connect} from 'react-redux';
import {Position} from "../../models/common/Position";
import {CircleMenuStates} from "../../models/landing/CircleMenuStates";
import {CircleRotationUtils} from "../../utils/CircleRotationUtils";
import Utils from "../../utils/Utils";
import TextSection from "./TextSection/TextSection";
import {Page} from "../../models/common/Page";
import {changePage} from "../../reducers/stages/stagesAction";
import StorageUtil, {StorageArrayKey} from "../../utils/StorageUtil";
import Icon from '../common/Icon/Icon';
import {ProvisionUtils} from "../../utils/ProvisionUtils";
import BrowserUtils from "../../utils/BrowserUtils";
import {UIOrientation} from '../../models/common/UIOrientation';
import { MenuContent } from '../../models/content/MenuContent';
import {ContentProvisioner} from "../../provision/ContentData";
import { CommonLabels } from '../../provision/CommonLabels';
import { RotatingDirection } from '../../models/content/RotatingDirection';
import { Section } from '../../models/content/Section';
import { TextSectionPosition } from '../../models/content/TextSectionPosition';

interface ContentPageProps {
    sections: Section[];
    changePage: any;
    currentPage: Page;
    uiOrientation: UIOrientation;
}

export interface ContentPageState {
    initialCircleOffsetDegrees: number; // offset of the circle in degrees at the start of dragging
    actualCircleOffsetDegrees: number; // offset of the circle in degrees at the current moment
    selectedMenuIndex: number; // index of the selected menu item
    dragInitiated: boolean;
    menuContent: MenuContent;
    isAutoRotating: boolean;
}

/**
 * ContentPage component. This component is responsible for displaying a given a selected menu item. The menu selection
 * is happening via the circle menu. For the whole page 0 degrees equals to the top of the circle, 90 degrees equals to
 * the right side of the circle, 180 degrees equals to the bottom of the circle and 270 degrees equals to the left side
 * of the circle. The css supports from -720 to 720 degrees for smooth animation, or the circle will rotate in the opposite
 * direction.
 *
 * @author Alexander Andreev
 */
class ContentPage extends React.Component<ContentPageProps, ContentPageState> {
    private readonly ROTATION_TRANSITION_MS = 660; // the time in ms for the rotation transition
    private sectionDegrees: number[] = []; // array of degrees for the center of each section.
    private sectionIconDegrees: number[] = []; // the degree for each icon to compensate the rotation of the section and be always on top.
    private dragStartingPos: Position;
    private slowRotationTimeout: any;
    private doingFastRotation: boolean = false;
    private lastOffsetDegrees = null;
    private wheelRef: React.RefObject<HTMLDivElement>;
    private mobileClickSimEnabled: boolean = false;
    private mobileDragStartTimeout: any;

    private readonly MIN_TIME_VISITED = 5000;
    private visitedTimeout: NodeJS.Timeout = null;

    constructor(props: ContentPageProps) {
        super(props);
        this.wheelRef = React.createRef();
        this.state = {
            actualCircleOffsetDegrees: 0,
            initialCircleOffsetDegrees: 0,
            selectedMenuIndex: 0,
            dragInitiated: false,
            menuContent: ContentProvisioner.getMenuContent(this.props.sections[0].menu),
            isAutoRotating: false
        };
        this.dragStartingPos = {
            x: 0,
            y: 0
        }
    }

    componentDidMount() {
        this.addCubeRotationListeners();
        this.calculateDegrees();
    }

    componentWillUnmount() {
        this.removeCubeRotationListeners();
    }

    addCubeRotationListeners() {
        if (!BrowserUtils.isMobile()) {
            this.wheelRef.current.addEventListener('dragstart', this.dragStart);
            this.wheelRef.current.addEventListener('drag', this.dragMove);
            this.wheelRef.current.addEventListener('dragend', this.dragEnd);
        } else {
            this.wheelRef.current.addEventListener('touchstart', this.dragStart);
            this.wheelRef.current.addEventListener('touchmove', this.dragMove);
            this.wheelRef.current.addEventListener('touchend', this.dragEnd);
        }
    }

    removeCubeRotationListeners() {
        if (!BrowserUtils.isMobile()) {
            this.wheelRef.current.removeEventListener('dragstart', this.dragStart);
            this.wheelRef.current.removeEventListener('drag', this.dragMove);
            this.wheelRef.current.removeEventListener('dragend', this.dragEnd);
        } else {
            this.wheelRef.current.removeEventListener('touchstart', this.dragStart);
            this.wheelRef.current.removeEventListener('touchmove', this.dragMove);
            this.wheelRef.current.removeEventListener('touchend', this.dragEnd);
        }
    }

    componentDidUpdate(prevProps: Readonly<ContentPageProps>, prevState: Readonly<ContentPageState>) {
        // Reset degrees to keep the current degrees between -720 and 720
        if (prevState.actualCircleOffsetDegrees !== this.state.actualCircleOffsetDegrees) {
            if (this.state.actualCircleOffsetDegrees > 540) {
                this.setState({actualCircleOffsetDegrees: this.state.actualCircleOffsetDegrees - 360});
            } else if (this.state.actualCircleOffsetDegrees < -540) {
                this.setState({actualCircleOffsetDegrees: this.state.actualCircleOffsetDegrees % 360 + 360});
            }
        }
        // Update the content when the top of the circle is rotated into another section
        if (prevState.selectedMenuIndex !== this.state.selectedMenuIndex) {
            clearTimeout(this.visitedTimeout);
            const visitedSections: CircleMenuStates[] = StorageUtil.getArrayFromLocalStorage(StorageArrayKey.VISITED_SECTIONS) || []
            const isVisited = visitedSections.includes(this.props.sections[this.state.selectedMenuIndex].menu);

            if (!isVisited) {
                this.visitedTimeout = setTimeout(() => {
                    StorageUtil.addItemToArrayInLocalStorage(StorageArrayKey.VISITED_SECTIONS, this.props.sections[this.state.selectedMenuIndex].menu);
                    this.setState({});
                    }, this.MIN_TIME_VISITED);
            }

            this.setState({
                menuContent: ContentProvisioner.getMenuContent(this.props.sections[this.state.selectedMenuIndex].menu)
            });
        }
    }

    /**
     * Retrieve the current cursor position and prepare circle for rotation.
     * @param event - the mouse down event
     */
    dragStart = (event: any) => {
        if (BrowserUtils.isMobile()) {
            this.dragStartingPos = CircleRotationUtils.initializeDragTouch(event);
            this.mobileClickSimEnabled = true;
            this.mobileDragStartTimeout = setTimeout(() => {
                this.setState({
                    initialCircleOffsetDegrees: this.state.actualCircleOffsetDegrees,
                    dragInitiated: true,
                    isAutoRotating: false
                });
            }, 100);
        } else {
            this.dragStartingPos = CircleRotationUtils.initializeDragCursor(event);
            this.setState({
                initialCircleOffsetDegrees: this.state.actualCircleOffsetDegrees,
                dragInitiated: true,
                isAutoRotating: false
            });
        }
    }

    /**
     * Calculate the new circle offset based on the current cursor position.
     * @param event - the mouse move event
     */
    dragMove = (event: any) => {
        if (this.state.dragInitiated) {
            let newState =  null;
            if (BrowserUtils.isMobile()) {
                this.mobileClickSimEnabled = false;
                newState = CircleRotationUtils.dragRotateTouch(event, this.dragStartingPos, this.state.initialCircleOffsetDegrees);
            } else {
                newState = CircleRotationUtils.dragRotateCursor(event, this.dragStartingPos, this.state.initialCircleOffsetDegrees);
            }
            if (Utils.isNotNull(newState) && newState.actualCircleOffsetDegrees !== this.state.actualCircleOffsetDegrees) {
                this.setState({
                    ...newState,
                    selectedMenuIndex: this.getSelectedSection(newState.actualCircleOffsetDegrees)
                });
            }
        }
    }

    /**
     * Stop the rotation and start the transition to the nearest section.
     * @param event - the mouse up event
     */
    dragEnd = (event: any) => {
       if (Utils.isNotNull(this.mobileDragStartTimeout)) {
           clearTimeout(this.mobileDragStartTimeout);
       }
        if (this.state.initialCircleOffsetDegrees === this.state.actualCircleOffsetDegrees) {
            if (BrowserUtils.isMobile() && this.mobileClickSimEnabled) {
                const iconName = event.target.className.split(" ").find(className => className.startsWith("fa"));
                const sectionToGoTo = this.props.sections.findIndex(section => section.icon === iconName);
                if (sectionToGoTo !== -1) {
                    this.selectSection(sectionToGoTo);
                }
            }
            this.setState({
                dragInitiated: false
            });
        } else if (Utils.isArrayNotEmpty(this.sectionDegrees)) {
            const potentialOffsetDegrees = 360 - this.sectionDegrees[this.state.selectedMenuIndex];
            const rotatingDirection = this.getRotatingDirectionFromDegrees(this.state.actualCircleOffsetDegrees, potentialOffsetDegrees);
            if (rotatingDirection !== RotatingDirection.NONE) {
                // Extra calculation to make sure the finalizing of rotation is to the right directions and no extra spins are being made
                if (rotatingDirection === RotatingDirection.COUNTER_CLOCKWISE && this.state.actualCircleOffsetDegrees > potentialOffsetDegrees) {
                    this.doingFastRotation = true;
                    this.setState(
                        {
                            actualCircleOffsetDegrees: this.state.actualCircleOffsetDegrees - 360,
                        }
                    )
                } else if (rotatingDirection === RotatingDirection.CLOCKWISE) {
                    if (this.state.actualCircleOffsetDegrees < potentialOffsetDegrees) {
                        this.doingFastRotation = true;
                        this.setState(
                            {
                                actualCircleOffsetDegrees: this.state.actualCircleOffsetDegrees + 360,
                            }
                        )
                    }
                }

                if (this.doingFastRotation) {
                    setTimeout(() => {
                        this.doingFastRotation = false;
                        this.triggerAutoRotation();
                        this.setState({
                            dragInitiated: false,
                            actualCircleOffsetDegrees: potentialOffsetDegrees
                        });
                    }, 50);
                } else {
                    this.triggerAutoRotation();
                    this.setState({
                        dragInitiated: false,
                        actualCircleOffsetDegrees: potentialOffsetDegrees
                    });
                }
            }
        }
    }

    /**
     * Trigger the rotation of the circle to the nearest section.
     */
    triggerAutoRotation() {
        if ( this.slowRotationTimeout) {
            clearTimeout(this.slowRotationTimeout);
        }
        this.setState({
            isAutoRotating: true
        });
        this.slowRotationTimeout = setTimeout(() => {
            if (this.state.isAutoRotating) {
                this.setState({
                    isAutoRotating: false
                });
            }
        }, this.ROTATION_TRANSITION_MS);
    }

    getSelectedSection(offsetDegrees: number): number {
        const sectionSize = Math.round(360 / this.props.sections.length);
        return Math.floor((((360 - offsetDegrees) + sectionSize / 2) / sectionSize) % this.props.sections.length);
    }

    calculateDegrees(): void {
        const { sections } = this.props;

        const sectionsSizeDeg = 360 / sections.length;
        const previousIconDegrees = [ ...this.sectionIconDegrees ];
        let currentOffset = this.state.actualCircleOffsetDegrees % 360;
        if (currentOffset > 180) {
            currentOffset -= 360;
        }
        if (Utils.isNull(this.lastOffsetDegrees) || currentOffset !== this.lastOffsetDegrees) {
            if (currentOffset - this.lastOffsetDegrees > 180) {
                currentOffset -= 360;
            } else if (currentOffset - this.lastOffsetDegrees < -180) {
                currentOffset += 360;
            }
            this.lastOffsetDegrees = currentOffset;
            for (let i = 0; i < sections.length; i++) {
                this.sectionDegrees[i] = (sectionsSizeDeg * i) % 360;
                while (this.sectionDegrees[i] < 0) {
                    this.sectionDegrees[i] += 360;
                }
                this.sectionIconDegrees[i] = -this.sectionDegrees[i] - currentOffset;
            }
        }

        if (!this.state.dragInitiated &&
            !this.state.isAutoRotating &&
            this.state.selectedMenuIndex === 0 &&
            this.state.actualCircleOffsetDegrees !== 0) {
            this.lastOffsetDegrees = null;
            this.setState({
                actualCircleOffsetDegrees: 0,
                initialCircleOffsetDegrees: 0,
                selectedMenuIndex: 0,
                dragInitiated: false,
                menuContent: ContentProvisioner.getMenuContent(this.props.sections[0].menu),
                isAutoRotating: false
            });
        }
    }

    getRotatingDirectionFromDegrees(startingDegree: number, goalDegree: number): RotatingDirection {
        if (startingDegree === goalDegree) {
            return RotatingDirection.NONE;
        }
        const threshold = 180;
        const tempGoalDegree = startingDegree > goalDegree ? goalDegree + 360 : goalDegree;
        return tempGoalDegree - startingDegree > threshold ? RotatingDirection.CLOCKWISE : RotatingDirection.COUNTER_CLOCKWISE;
    }


    getRotatingDirectionFromIndex(startingIndex: number, goalIndex: number): RotatingDirection {
        if (startingIndex === goalIndex) {
            return RotatingDirection.NONE;
        }
        const sectionsSize = this.props.sections.length;
        const threshold = sectionsSize / 2;
        const tempGoalIndex = startingIndex > goalIndex ? goalIndex + sectionsSize : goalIndex;
        return tempGoalIndex - startingIndex > threshold ? RotatingDirection.CLOCKWISE : RotatingDirection.COUNTER_CLOCKWISE;
    }

    selectSection(index: number) {
        console.log("selectSection", index);
        if (!this.state.isAutoRotating || this.mobileClickSimEnabled) {
            this.mobileClickSimEnabled = false;
            const rotatingDirection = this.getRotatingDirectionFromIndex(this.state.selectedMenuIndex, index);
            if (rotatingDirection !== RotatingDirection.NONE) {
                const potentialOffsetDegrees = 360 - this.sectionDegrees[index];
                if (rotatingDirection === RotatingDirection.CLOCKWISE && this.state.actualCircleOffsetDegrees > potentialOffsetDegrees) {
                    this.doingFastRotation = true;
                    this.setState(
                        {
                            actualCircleOffsetDegrees: this.state.actualCircleOffsetDegrees - 360,
                        }
                    )
                } else if (rotatingDirection === RotatingDirection.COUNTER_CLOCKWISE && this.state.actualCircleOffsetDegrees < potentialOffsetDegrees) {
                    this.doingFastRotation = true;
                    this.setState(
                        {
                            actualCircleOffsetDegrees: this.state.actualCircleOffsetDegrees + 360,
                        }
                    )
                }

                if (this.doingFastRotation) {
                    setTimeout(() => {
                        this.doingFastRotation = false;
                        this.triggerAutoRotation();
                        this.setState({
                            selectedMenuIndex: index,
                            actualCircleOffsetDegrees: potentialOffsetDegrees
                        });
                    }, 0);
                } else {
                    this.triggerAutoRotation();
                    this.setState({
                        selectedMenuIndex: index,
                        actualCircleOffsetDegrees: potentialOffsetDegrees
                    });
                }
            }
        } else {
        }
    }

    calculateSectionEdgeDegrees(sectionDegrees: number): number {
        const { sections } = this.props;

        const sectionsSizeDeg = 360 / sections.length;
        return (sectionDegrees + (sectionsSizeDeg / 2)) % 360;
    }

    renderSections(): JSX.Element[] {
        const sections: JSX.Element[] = [];
        const visitedSections: CircleMenuStates[] = StorageUtil.getArrayFromLocalStorage(StorageArrayKey.VISITED_SECTIONS) || [];
        this.props.sections.forEach((section: Section, index) => {
           const isVisited = visitedSections.includes(section.menu);
           sections.push(
               <div className={`menu-section circle-rot${this.sectionDegrees[index]}deg ${this.state.selectedMenuIndex === index ? "selected": ""}`}
                    onClick={() => {
                        this.selectSection(index);
                    }} key={section.menu.toString()}>
                   <div className={`menu-icon-wrapper circle-rot${this.sectionIconDegrees[index]}deg`}>
                       <Icon className={"menu-icon"}  icon={section.icon}></Icon>
                       {!isVisited && this.props.uiOrientation === UIOrientation.LANDSCAPE && <div className={"icon-new"}>
                           {CommonLabels.NEW}
                       </div>}
                   </div>
               </div>
           )
        });
        return sections;
    }

    renderSectionEdges(): JSX.Element[] {
        const sections: JSX.Element[] = [];
        this.props.sections.forEach((section: Section, index) => {
            sections.push(<div draggable={false} className={`section-edge circle-rot${this.sectionDegrees[index]}deg`} key={section.menu.toString()}/>
            )
        });
        return sections;
    }

    getContentPageAdditionalClasses(): string {
        let classes: string = "";
        if (this.state.dragInitiated) {
            classes = classes.concat(" dragging");
        }
        if (this.state.isAutoRotating) {
            classes = classes.concat(" slow-rotation");
        }
        return classes;
    }

    getPreviousSectionIndex(): number {
        const num = this.state.selectedMenuIndex - 1;
        if (num < 0) {
            return this.props.sections.length - 1;
        } else {
            return num;
        }
    }

    getNextSectionIndex(): number {
        const num = this.state.selectedMenuIndex + 1;
        if (num >= this.props.sections.length) {
            return 0;
        } else {
            return num;
        }
    }

    render(){
        if (!this.doingFastRotation) {
            this.calculateDegrees();
        }
        return (
        <div className={`content-page-wrapper ${this.getContentPageAdditionalClasses()}`}>
            <div className={"indicator"}>
                <div className={"indicator-arrow-point"} />
            </div>
            <div draggable={!this.state.isAutoRotating} className={`content-outer-circle circle-rot${this.state.actualCircleOffsetDegrees}deg`} ref={this.wheelRef}>
                {this.renderSections()}
            </div>
            {!BrowserUtils.isMobile() &&
                <div className={`content-outer-circle-sections circle-rot${this.calculateSectionEdgeDegrees(this.state.actualCircleOffsetDegrees)}deg`}>
                    {this.renderSectionEdges()}
                </div>
            }
            <div className={`box ${this.props.currentPage.toLowerCase()}`}>
                <div className="box-overlay"></div>
                <div className={"section-title"}>
                    <div className={"section-title-top"}>{this.props.currentPage === Page.CLIENT_APPROACH ? CommonLabels.CLIENT_APPROACH : CommonLabels.EXPERIENCE}</div>
                    <div className={"section-title-bottom"}>{this.state.menuContent.title}</div>
                </div>
            </div>
            <div className={"text-sections-wrapper"}>
                <TextSection data={this.state.menuContent.leftContent}
                             sectionPosition={TextSectionPosition.LEFT}
                             arrowClickHandler={this.props.uiOrientation !== UIOrientation.PORTRAIT ?
                                 () => this.selectSection(this.getPreviousSectionIndex()) : null}/>
                <TextSection data={this.state.menuContent.rightContent}
                             sectionPosition={TextSectionPosition.RIGHT}
                             arrowClickHandler={this.props.uiOrientation !== UIOrientation.PORTRAIT ?
                                 () => this.selectSection(this.getNextSectionIndex()) : null}/>
            </div>
        </div>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { cubeOpened, selectedMenu } = state.cubesReducer;
        const { currentPage } = state.stagesReducer;
        const { uiOrientation } = state.windowReducer;
        return {
            ...ownProps,
            selectedMenu,
            cubeOpened,
            currentPage,
            uiOrientation,
            sections: currentPage === Page.CLIENT_APPROACH ? ProvisionUtils.getClientApproachSections() : ProvisionUtils.getPastExperienceSections()
        }
    }
, { changePage })(ContentPage);

