import './TextSection.scss';
import React from "react";
import Utils from "../../../utils/Utils";
import {connect} from "react-redux";
import {WindowSize} from "../../../reducers/window/windowReducer";
import {UIOrientation} from "../../../models/common/UIOrientation";
import {LayoutType} from "../../../models/common/LayoutType";
import { ContentData } from '../../../models/content/ContentData';
import { CustomContentTypes } from '../../../models/content/CustomContentTypes';
import { TextSectionPosition } from '../../../models/content/TextSectionPosition';

interface TextSectionProps {
    data: ContentData;
    sectionPosition: TextSectionPosition;
    windowSize: WindowSize;
    uiOrientation: UIOrientation;
    layoutType: LayoutType;
    arrowClickHandler: () => void;
}

/**
 * TextSection component. This component is responsible for displaying a given a selected menu item.
 *
 * @author Alexander Andreev
 */
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
        if (prevProps.data.description !== this.props.data.description) {
                if (this.props.uiOrientation === UIOrientation.PORTRAIT) {
                    this.myRef.current.scrollTo(0, 0);
                } else if (Utils.isNotNull(this.resizeTimeout)) {
                    clearTimeout(this.resizeTimeout);
                    this.resizeTimeout = setTimeout(() => {
                        this.updateDimensions();
                    });
                }
        }

        if (prevProps.layoutType !== this.props.layoutType || prevProps.uiOrientation !== this.props.uiOrientation) {
            clearTimeout(this.resizeTimeout);
            this.updateDimensions();
        }
    }


    /**
     * Updates the dimensions of the text section, until the text fits the screen. Applies only for landscape mode.
     * @param isResized - whether the text has its original size or not.
     */
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
                        if (this.currentFontSize > 1) {
                            this.currentFontSize -= 0.1;
                        } else {
                            this.currentFontSize -= 0.025;
                        }
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
        }
    }

    /**
     * Renders a custom content (instead of text), if the content type is custom.
     * @param data - the custom data.
     */
    private getContentDescription = (data: ContentData) => {
        if (Utils.isNotNull(data.customContent)) {
            if (data.customContent === CustomContentTypes.TECHNOLOGY_LIST) {
                return <div className={"items-list"}>
                    {data.description.split(",").map((phrase, index) => {
                        return <div key={index} className={"technology-item"}>{phrase}</div>
                    })}
                </div>
            } else if (data.customContent === CustomContentTypes.COMPANIES_LIST) {
                return <div className={"items-list with-background"}>
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
                    <div className="outer-text-border" onClick={this.props.arrowClickHandler}></div>
                    <div className="inner-text-border"></div>
                    <div className={"content-text-wrapper"} ref={this.myRef}>
                        <div className={"content-text"}>
                            {this.getContentDescription(data)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: any, ownProps) => {
        const { windowSize, uiOrientation, layoutType } = state.windowReducer;
        return {
            ...ownProps,
            windowSize,
            uiOrientation,
            layoutType
        }
    }
)(TextSection);

