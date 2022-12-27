import React from 'react';
import './ContentPage.scss';
import {connect} from 'react-redux';
import {Position} from "../../models/common/Position";
import {CircleMenuStates} from "../../models/landing/CircleMenuStates";
import {CircleRotationUtils} from "../../utils/CircleRotationUtils";
import Utils from "../../utils/Utils";
import TextSection, {TextSectionPosition} from "./TextSection";
import {ContentData, MenuContent} from '../../labels/ContentLabels';
import {Page} from "../../models/common/Page";
import {changePage} from "../../reducers/stages/stagesAction";
import AppStorage, {StorageArrayKey, StorageKey} from "../../utils/AppStorage";
import Icon from '../common/icon/Icon';
import {ProvisionUtils} from "../../utils/ProvisionUtils";
import BrowserUtils from "../../utils/BrowserUtils";

interface ContentPageProps {
    isClosing: boolean;
    sections: Section[];
    changePage: any;
    currentPage: Page;
}

enum RotatingDirection {
    CLOCKWISE = 'CLOCKWISE',
    COUNTER_CLOCKWISE = 'COUNTER_CLOCKWISE',
    NONE = 'NONE'
}

export interface Section {
    icon: any;
    menu: CircleMenuStates;
}

export interface ContentPageState {
    initialCircleOffsetDegrees: number;
    actualCircleOffsetDegrees: number;
    selectedMenuIndex: number;
    dragInitiated: boolean;
    menuContent: MenuContent;
    isSlowRotation: boolean;
}


class ContentPage extends React.Component<ContentPageProps, ContentPageState> {
    private sectionDegrees: number[] = [];
    private sectionIconDegrees: number[] = [];
    private dragStartingPos: Position;
    private readonly ROTATION_TRANSITION_MS = 660;
    private slowRotationTimeout: any;
    private doingFastRotation: boolean = false;
    private lastOffsetDegrees = null;

    private readonly MIN_TIME_VISITED = 5000;
    private visitedTimeout: NodeJS.Timeout = null;

    constructor(props: ContentPageProps) {
        console.log('ContentPage constructor');
        super(props);
        this.state = {
            actualCircleOffsetDegrees: 0,
            initialCircleOffsetDegrees: 0,
            selectedMenuIndex: 0,
            dragInitiated: false,
            menuContent: ContentData.getMenuContent(this.props.sections[0].menu),
            isSlowRotation: false
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

    componentDidUpdate(prevProps: Readonly<ContentPageProps>, prevState: Readonly<ContentPageState>) {
        if (prevState.actualCircleOffsetDegrees !== this.state.actualCircleOffsetDegrees) {
            if (this.state.actualCircleOffsetDegrees > 540) {
                this.setState({actualCircleOffsetDegrees: this.state.actualCircleOffsetDegrees - 360});
            } else if (this.state.actualCircleOffsetDegrees < -540) {
                this.setState({actualCircleOffsetDegrees: this.state.actualCircleOffsetDegrees % 360 + 360});
            }
        }
        if (prevState.selectedMenuIndex !== this.state.selectedMenuIndex) {
            clearTimeout(this.visitedTimeout);
            const visitedSections: CircleMenuStates[] = AppStorage.getArrayFromLocalStorage(StorageArrayKey.VISITED_SECTIONS) || []
            const isVisited = visitedSections.includes(this.props.sections[this.state.selectedMenuIndex].menu);

            if (!isVisited) {
                this.visitedTimeout = setTimeout(() => {
                    AppStorage.addItemToArrayInLocalStorage(StorageArrayKey.VISITED_SECTIONS, this.props.sections[this.state.selectedMenuIndex].menu);
                    this.setState({});
                    }, this.MIN_TIME_VISITED);
            }

            this.setState({
                menuContent: ContentData.getMenuContent(this.props.sections[this.state.selectedMenuIndex].menu)
            });
        }
    }

    dragStart = (event: any) => {
        console.log('dragStart', event.target);
        this.dragStartingPos = CircleRotationUtils.initializeDragCursor(event);
        this.setState({
            initialCircleOffsetDegrees: this.state.actualCircleOffsetDegrees,
            dragInitiated: true,
            isSlowRotation: false
        });
    }

    dragMove = (event: any) => {
        console.log("move");
        const newState = CircleRotationUtils.dragRotateCursor(event, this.dragStartingPos, this.state.initialCircleOffsetDegrees);
        if (Utils.isNotNull(newState) && newState.actualCircleOffsetDegrees !== this.state.actualCircleOffsetDegrees) {
            this.setState({
                ...newState,
                selectedMenuIndex: this.getSelectedSection(newState.actualCircleOffsetDegrees)
            });
        }
    }

    dragEnd = (event: any) => {
        console.log('dragEnd');
        if (Utils.isArrayNotEmpty(this.sectionDegrees)) {
            const potentialOffsetDegrees = 360 - this.sectionDegrees[this.state.selectedMenuIndex];
            const rotatingDirection = this.getRotatingDirectionFromDegrees(this.state.actualCircleOffsetDegrees, potentialOffsetDegrees);
            if (rotatingDirection !== RotatingDirection.NONE) {
                if (rotatingDirection === RotatingDirection.COUNTER_CLOCKWISE && this.state.actualCircleOffsetDegrees > potentialOffsetDegrees) {
                    this.doingFastRotation = true;
                    this.setState(
                        {
                            actualCircleOffsetDegrees: this.state.actualCircleOffsetDegrees - 360,
                        }
                    )
                } else if (rotatingDirection === RotatingDirection.CLOCKWISE) {
                    // this.sectionIconDegrees[this.state.selectedMenuIndex] += 360;
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
                        this.triggerSlowRotation();
                        this.setState({
                            dragInitiated: false,
                            actualCircleOffsetDegrees: potentialOffsetDegrees
                        });
                    }, 50);
                } else {
                    this.triggerSlowRotation();
                    this.setState({
                        dragInitiated: false,
                        actualCircleOffsetDegrees: potentialOffsetDegrees
                    });
                }
            }
        }
    }

    addCubeRotationListeners() {
        window.addEventListener('dragstart', this.dragStart);
        window.addEventListener('drag', this.dragMove);
        window.addEventListener('dragend', this.dragEnd);
    }

    removeCubeRotationListeners() {
        window.removeEventListener('dragstart', this.dragStart);
        window.removeEventListener('drag', this.dragMove);
        window.removeEventListener('dragend', this.dragEnd);
    }

    triggerSlowRotation() {
        if ( this.slowRotationTimeout) {
            clearTimeout(this.slowRotationTimeout);
        }
        this.setState({
            isSlowRotation: true
        });
        this.slowRotationTimeout = setTimeout(() => {
            if (this.state.isSlowRotation) {
                this.setState({
                    isSlowRotation: false
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
            !this.state.isSlowRotation &&
            this.state.selectedMenuIndex === 0 &&
            this.state.actualCircleOffsetDegrees !== 0) {
            this.lastOffsetDegrees = null;
            this.setState({
                actualCircleOffsetDegrees: 0,
                initialCircleOffsetDegrees: 0,
                selectedMenuIndex: 0,
                dragInitiated: false,
                menuContent: ContentData.getMenuContent(this.props.sections[0].menu),
                isSlowRotation: false
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

    clickSection(index: number) {
        if (!this.state.isSlowRotation) {
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
                        this.triggerSlowRotation();
                        this.setState({
                            selectedMenuIndex: index,
                            actualCircleOffsetDegrees: potentialOffsetDegrees
                        });
                    }, 0);
                } else {
                    this.triggerSlowRotation();
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
        const visitedSections: CircleMenuStates[] = AppStorage.getArrayFromLocalStorage(StorageArrayKey.VISITED_SECTIONS) || [];
        this.props.sections.forEach((section: Section, index) => {
           const isVisited = visitedSections.includes(section.menu);
           sections.push(
               <div className={`menu-section circle-rot${this.sectionDegrees[index]}deg ${this.state.selectedMenuIndex === index ? "selected": ""}`}
                    onClick={() => { this.clickSection(index); }} key={section.menu.toString()}>
                   <div className={`menu-icon-wrapper circle-rot${this.sectionIconDegrees[index]}deg`}>
                       <Icon className={"menu-icon"}  icon={section.icon}></Icon>
                       {!isVisited && <div className={"icon-new"}>New*</div>}
                   </div>
               </div>
           )
        });
        return sections;
    }

    renderSectionEdges(): JSX.Element[] {
        const sections: JSX.Element[] = [];
        this.props.sections.forEach((section: Section, index) => {
            sections.push(<div className={`section-edge circle-rot${this.sectionDegrees[index]}deg`} key={section.menu.toString()}/>
            )
        });
        return sections;
    }

    getContentPageAdditionalClasses(): string {
        let classes: string = "";
        if (this.props.isClosing) {
            classes = classes.concat(" closing");
        }
        if (this.state.dragInitiated) {
            classes = classes.concat(" dragging");
        }
        if (this.state.isSlowRotation) {
            classes = classes.concat(" slow-rotation");
        }
        return classes;
    }

    render(){
        if (!this.doingFastRotation) {
            this.calculateDegrees();
        }
        return (
        <div draggable={!this.state.isSlowRotation} className={`content-page-wrapper ${this.getContentPageAdditionalClasses()}`}>
            <div className={"indicator"}>
                <div className={"indicator-arrow-point"} />
            </div>
            <div className={`content-outer-circle circle-rot${this.state.actualCircleOffsetDegrees}deg`}>
                {this.renderSections()}
            </div>
            <div className={`content-outer-circle-sections circle-rot${this.calculateSectionEdgeDegrees(this.state.actualCircleOffsetDegrees)}deg`}>
                {this.renderSectionEdges()}
            </div>
            <div className={`box ${this.props.currentPage.toLowerCase()}`}>
                <div className="box-overlay"></div>
                <div className={"section-title"}>
                    <div className={"section-title-top"}>{this.props.currentPage === Page.CLIENT_APPROACH ? "Client approach" : "Experience"}</div>
                    <div className={"section-title-bottom"}>{this.state.menuContent.title}</div>
                </div>
            </div>
            <div className={"text-sections-wrapper"}>
                <TextSection data={this.state.menuContent.leftContent}
                             sectionPosition={TextSectionPosition.LEFT}/>
                <TextSection data={this.state.menuContent.rightContent}
                             sectionPosition={TextSectionPosition.RIGHT}/>
            </div>
        </div>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { cubeOpened, selectedMenu } = state.cubesReducer;
        const { currentPage } = state.stagesReducer;
        return {
            ...ownProps,
            selectedMenu,
            cubeOpened,
            currentPage,
            sections: currentPage === Page.CLIENT_APPROACH ? ProvisionUtils.getClientApproachSections() : ProvisionUtils.getPastExperienceSections()
        }
    }
, { changePage })(ContentPage);

