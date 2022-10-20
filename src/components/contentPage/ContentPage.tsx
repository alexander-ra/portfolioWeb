import React from 'react';
import './ContentPage.scss';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {Position} from "../../models/common/Position";
import {CircleMenuStates} from "../../models/landing/CircleMenuStates";
import {CircleRotationUtils} from "../../utils/CircleRotationUtils";
import Utils from "../../utils/Utils";
import TextSection, {TextSectionPosition} from "./TextSection";
import {ContentData, ContentLabels, MenuContent} from '../../labels/ContentLabels';
import {Page} from "../../models/common/Page";
import {changePage} from "../../reducers/stages/stagesAction";

interface ContentPageProps {
    isClosing: boolean;
    sections: Section[];
    changePage: any;
}

export interface Section {
    icon: IconDefinition;
    menu: CircleMenuStates;
}

export interface ContentPageState {
    initialCircleOffsetDegrees: number;
    actualCircleOffsetDegrees: number;
    selectedMenuIndex: number;
    dragInitiated: boolean;
    menuContent: MenuContent
}


class ContentPage extends React.Component<ContentPageProps, ContentPageState> {
    private sectionDegrees: number[] = [];
    private sectionIconDegrees: number[] = [];
    private dragStartingPos: Position;
    private test = false;

    constructor(props: ContentPageProps) {
        super(props);
        this.dragStartingPos = {
            x: 0,
            y: 0
        }
        this.state = {
            actualCircleOffsetDegrees: 0,
            initialCircleOffsetDegrees: 0,
            selectedMenuIndex: 0,
            dragInitiated: false,
            menuContent: ContentData.getMenuContent(this.props.sections[0].menu)
        };
        this.addCubeRotationListeners();
    }

    componentDidUpdate(prevProps: Readonly<ContentPageProps>, prevState: Readonly<ContentPageState>) {
        if (prevState.actualCircleOffsetDegrees !== this.state.actualCircleOffsetDegrees) {
            if (this.state.actualCircleOffsetDegrees > 360) {
                this.setState({actualCircleOffsetDegrees: this.state.actualCircleOffsetDegrees % 360})
            } else if (this.state.actualCircleOffsetDegrees < 0) {
                this.setState({actualCircleOffsetDegrees: (this.state.actualCircleOffsetDegrees % 360) + 360})
            }
        }
        if (prevState.selectedMenuIndex !== this.state.selectedMenuIndex) {
            this.setState({
                menuContent: ContentData.getMenuContent(this.props.sections[this.state.selectedMenuIndex].menu)
            });
        }
    }

    addCubeRotationListeners() {
        window.addEventListener("dragstart", (event) => {
            this.test = false;
            this.dragStartingPos = CircleRotationUtils.initializeDragCursor(event);
            this.setState({
                initialCircleOffsetDegrees: this.state.actualCircleOffsetDegrees,
                dragInitiated: true
            });
        });
        window.addEventListener("drag", (event) => {
            const newState = CircleRotationUtils.dragRotateCursor(event, this.dragStartingPos, this.state.initialCircleOffsetDegrees);
            if (Utils.isNotNull(newState) && newState.actualCircleOffsetDegrees !== this.state.actualCircleOffsetDegrees) {
                this.setState({
                    ...newState,
                    selectedMenuIndex: this.getSelectedSection(newState.actualCircleOffsetDegrees)
                });
            }
        });
        window.addEventListener("dragend", () => {
            let offset = 360;
            this.test = false;
            if (this.state.actualCircleOffsetDegrees !== 0) {
                if (Math.abs(this.sectionDegrees[this.state.selectedMenuIndex] - this.state.actualCircleOffsetDegrees) < 180) {
                    offset = 0;
                }
                if (this.sectionIconDegrees[this.state.selectedMenuIndex] > 180) {
                    this.test = true;
                }
            }
            this.setState({
                actualCircleOffsetDegrees: offset - this.sectionDegrees[this.state.selectedMenuIndex],
                dragInitiated: false
            })
        });
        window.addEventListener("touchstart", (event) => {
            this.dragStartingPos = CircleRotationUtils.initializeDragTouch(event);
            this.setState({
                dragInitiated: true
            });
        });
        window.addEventListener("touchmove", (event) => {
            const newState = CircleRotationUtils.dragRotateTouch(event, this.dragStartingPos, this.state.initialCircleOffsetDegrees);
            if (newState.initialCircleOffsetDegrees !== this.state.initialCircleOffsetDegrees) {
                this.setState(newState);
            }
        });
        window.addEventListener("touchend", () => {
            this.setState({
                dragInitiated: false
            })
        });
    }

    getSelectedSection(offsetDegrees: number): number {
        const sectionSize = Math.round(360 / this.props.sections.length);
        return Math.floor((((360 - offsetDegrees) + sectionSize / 2) / sectionSize) % this.props.sections.length);
    }

    calculateDegrees(): void {
        const { sections } = this.props;

        const sectionsSizeDeg = 360 / sections.length;
        for (let i = 0; i < sections.length; i++) {
            this.sectionDegrees[i] = (sectionsSizeDeg * i) % 360;
            while (this.sectionDegrees[i] < 0) {
                this.sectionDegrees[i] += 360;
            }
            this.sectionIconDegrees[i] = (-this.sectionDegrees[i] - this.state.actualCircleOffsetDegrees) % 360;
            while (this.sectionIconDegrees[i] < 0) {
                this.sectionIconDegrees[i] += 360;
            }
        }
    }

    calculateSectionEdgeDegrees(sectionDegrees: number): number {
        const { sections } = this.props;

        const sectionsSizeDeg = 360 / sections.length;
        return (sectionDegrees + (sectionsSizeDeg / 2)) % 360;
    }

    renderSections(): JSX.Element[] {
        const sections: JSX.Element[] = [];
        this.props.sections.forEach((section: Section, index) => {
           sections.push(
               <div className={`menu-section circle-rot${this.sectionDegrees[index]}deg ${this.state.selectedMenuIndex === index ? "selected": ""}`}>
                   <FontAwesomeIcon className={`menu-icon circle-rot${this.sectionIconDegrees[index]}deg`} icon={section.icon}/>
               </div>
           )
        });
        return sections;
    }

    renderSectionEdges(): JSX.Element[] {
        const sections: JSX.Element[] = [];
        this.props.sections.forEach((section: Section, index) => {
            sections.push(<div className={`section-edge circle-rot${this.sectionDegrees[index]}deg`}></div>
            )
        });
        return sections;
    }

    render(){
        this.calculateDegrees();
        if (this.test) {
            this.sectionIconDegrees[this.state.selectedMenuIndex] += 360;
        }
        return (<div draggable={true} className={`content-page-wrapper ${this.props.isClosing ? "closing" : ""} ${this.state.dragInitiated ? "dragging" : ""}`}>
            <div className={"indicator"}>
                <div className={"indicator-arrow-point"} />
            </div>
            <div className={`content-outer-circle circle-rot${this.state.actualCircleOffsetDegrees}deg`}>
                {this.renderSections()}
            </div>
            <div className={`content-outer-circle-sections circle-rot${this.calculateSectionEdgeDegrees(this.state.actualCircleOffsetDegrees)}deg`}>
                {this.renderSectionEdges()}
            </div>
            <div className="box">
                <div className="box-overlay"></div>
                <div className={"section-title"}>
                    <div className={"section-title-top"}>Experience</div>
                    <div className={"section-title-bottom"}>{this.state.menuContent.title}</div>
                </div>
                <div className="back-button" onClick={() => {this.props.changePage(Page.LANDING)}}>
                    <span>Back to cube</span>
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
        return {
            ...ownProps,
            selectedMenu,
            cubeOpened
        }
    }
, { changePage })(ContentPage);

