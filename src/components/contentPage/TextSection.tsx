import { IconProp } from "@fortawesome/fontawesome-svg-core";
import './TextSection.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {ContentData, ContentLabels} from "../../labels/ContentLabels";
import Wings from "./Wings";
import {current} from "@reduxjs/toolkit";
import Utils from "../../utils/Utils";
import { connect } from "react-redux";
import {WindowSize} from "../../reducers/window/windowReducer";
import {UIOrientation} from "../core/UIOrientation";

export enum TextSectionPosition {
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

interface TextSectionProps {
    data: ContentData;
    sectionPosition: TextSectionPosition;
    windowSize: WindowSize;
    uiOrientation: UIOrientation;
}


class TextSection extends React.Component<TextSectionProps> {
    private myRef: React.RefObject<HTMLDivElement>;
    private readonly DEFAULT_FONT_SIZE = 1.5;
    private currentFontSize = this.DEFAULT_FONT_SIZE;

    constructor(props: TextSectionProps) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', () => {this.updateDimensions()});
    }

    componentDidUpdate(prevProps: Readonly<TextSectionProps>, prevState: Readonly<{}>, snapshot?: any) {
        setTimeout(() => {
            if (prevProps.data.description !== this.props.data.description) {
                this.updateDimensions();
            }
        });
    }

    private updateDimensions = (previousSize?: number) => {
        const currElement = this.myRef.current;
        if (Utils.isNotNull(currElement?.style)) {
            if (this.props.uiOrientation === UIOrientation.LANDSCAPE) {
                if (this.currentFontSize !== this.DEFAULT_FONT_SIZE && Utils.isNull(previousSize)) {
                    currElement.style.fontSize = `${this.DEFAULT_FONT_SIZE}rem`;
                    currElement.style.visibility = `hidden`;
                    this.currentFontSize = this.DEFAULT_FONT_SIZE;
                    setTimeout(() => {
                        this.updateDimensions(this.DEFAULT_FONT_SIZE);
                    });
                } else {
                    const parentElement = currElement?.parentElement;

                    if (parentElement?.offsetHeight / currElement?.offsetHeight >= 1.33) {
                        const parentHeightDiff = parentElement?.offsetHeight - currElement?.offsetHeight;
                        currElement.style.margin = `${parentHeightDiff / 2}px 0`;
                        currElement.style.visibility = `visible`;
                    } else {
                        this.currentFontSize = previousSize - 0.1;
                        currElement.style.fontSize = `${this.currentFontSize}rem`;
                        currElement.style.visibility = `hidden`;
                        setTimeout(() => {
                            this.updateDimensions(this.currentFontSize);
                        });
                    }
                }
            } else {
                currElement.style.visibility = `visible`;
                currElement.style.margin = null;
                currElement.style.fontSize = null;
            }
        } else {
            console.log("Unable to get element");
        }
    }

    render(){
        const { data } = this.props;
        return (
            <div className={`text-section text-section-${this.props.sectionPosition.toLowerCase()}`}>
                <div className={"content"}>
                    <div className={"content-title"}>{data.title}</div>
                    <div className="mask"></div>
                    <div className="mask-dve"></div>
                    <div className={"content-text"} ref={this.myRef}>
                        {/*<div className={"content-title"}>{data.title}</div>*/}
                        {data.description}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: any, ownProps) => {
        const { windowSize, uiOrientation } = state.windowReducer;
        return {
            ...ownProps,
            windowSize,
            uiOrientation
        }
    }
)(TextSection);

