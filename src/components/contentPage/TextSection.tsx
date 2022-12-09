import './TextSection.scss';
import React from "react";
import {ContentData, CustomContentTypes} from "../../labels/ContentLabels";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";
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
    private isResizing: boolean = false;
    private resizeTimeout: NodeJS.Timeout;

    constructor(props: TextSectionProps) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', () => {this.updateDimensions()});
    }

    componentDidUpdate(prevProps: Readonly<TextSectionProps>, prevState: Readonly<{}>, snapshot?: any) {
        if (prevProps.data.description !== this.props.data.description && Utils.isNotNull(this.resizeTimeout)) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.updateDimensions();
            });
        }
    }

    private updateDimensions = (isResized?: boolean) => {
        const currElement = this.myRef.current;
        if (Utils.isNotNull(currElement?.style)) {
            if (this.props.uiOrientation === UIOrientation.LANDSCAPE) {
                if (this.currentFontSize !== this.DEFAULT_FONT_SIZE && Utils.isNull(isResized)) {
                    currElement.style.fontSize = `${this.DEFAULT_FONT_SIZE}rem`;
                    currElement.style.visibility = `hidden`;
                    this.currentFontSize = this.DEFAULT_FONT_SIZE;
                    clearTimeout(this.resizeTimeout);
                    this.resizeTimeout = setTimeout(() => {
                        this.updateDimensions();
                    });
                } else {
                    const parentElement = currElement?.parentElement;

                    if (parentElement?.offsetHeight / currElement?.offsetHeight >= 1.33) {
                        const parentHeightDiff = parentElement?.offsetHeight - currElement?.offsetHeight;
                        currElement.style.margin = `${parentHeightDiff / 2}px 0`;
                        currElement.style.visibility = `visible`;
                    } else {
                        this.currentFontSize = this.currentFontSize - 0.1;
                        currElement.style.fontSize = `${this.currentFontSize}rem`;
                        currElement.style.visibility = `hidden`;
                        clearTimeout(this.resizeTimeout);
                        this.resizeTimeout = setTimeout(() => {
                            this.updateDimensions(true);
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

    private getContentDescription = (data: ContentData) => {
        if (Utils.isNotNull(data.customContent)) {
            if (data.customContent === CustomContentTypes.TECHNOLOGY_LIST) {
                return <div className={"items-list"}>
                    {data.description.split(",").map((phrase, index) => {
                        return <div key={index} className={"technology-item"}>{phrase}</div>
                    })}
                </div>
            } else if (data.customContent === CustomContentTypes.COMPANIES_LIST) {
                return <div className={"items-list"}>
                    {data.description.split(",").map((phrase, index) => {
                        return <div key={index} className={`logo-item ${phrase}`}></div>
                    })}
                </div>
            }
        } else {
            return data.description;
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
                        {this.getContentDescription(data)}
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

