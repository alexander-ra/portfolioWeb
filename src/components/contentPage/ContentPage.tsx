import React from 'react';
import './ContentPage.scss';
import {connect} from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFileCode, faHome, faMoneyBillTrendUp, faUserTie, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {Position} from "../../models/common/Position";
import {CircleMenuStates} from "../../models/landing/CircleMenuStates";
import {CircleRotationUtils} from "../../utils/CircleRotationUtils";
import Utils from "../../utils/Utils";
import Typewriter from "../common/Typewriter";

interface ContentPageProps {
    isClosing: boolean;
    sections: Section[];
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
            dragInitiated: false
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
            <div className={"longer-text"}>
                <div className={"text-section text-section-left"}>

                    <div className="top-wing wing back-wing"></div>
                    <div className={"content"}>
                        <FontAwesomeIcon className={`content-icon`} icon={['fab', 'angular']}/>
                        <div className={"content-title"}>
                            Angular JS
                        </div>
                        <div className={"content-body"}>
                            Initially started working on projects in the initial AngularJS and transitioning to Angular2+ after that. I have exellent understanding of all the inner modules of the framework (Component Livecycles, Angular Directives, RxJS, Angular Animations, Reactive forms, etc..) and have been a Team Lead for projects written in Angular2+. I love angular for the fact that many of the common problems for new project have already been solved in a meaningfull way, so team familiar with it can go straight into developing the business part of the project with relative ease.
                        </div>
                    </div>
                    <div className="middle-wing wing"></div>
                    <div className="bottom-wing wing"></div>
                </div>
                <div className={"text-section text-section-right"}>
                    <div className="top-wing wing back-wing"></div>
                    <div className={"content"}>
                        <FontAwesomeIcon className={`content-icon`} icon={['fab', 'react']}/>
                        <div className={"content-title"}>
                            React JS
                        </div>
                        <div className={"content-body"}>
                            Around the beginning of 2021 I have decided to move on and try something new by discovering the ReactJS library. Delivering software mostly for real-money handling gaming companies I have a great understanding of how best to handle a lot of dynamic elements for many types of devices using the Virtual DOM, optimising them with The useful React Hooks, while not compromising security of data. I love ReactJS for its ease of use, high responsibility for the user and freedom to really go out of the box and stand out in a unique way in every different project.
                        </div>
                    </div>
                    <div className="middle-wing wing"></div>
                    <div className="bottom-wing wing"></div>
                </div>
            </div>
            <div className="box">
                <div className="box-overlay"></div>
                <div className={"section-title"}>
                    <div className={"section-title-top"}>Experience</div>
                    <div className={"section-title-bottom"}>By Title</div>
                </div>
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
)(ContentPage);

