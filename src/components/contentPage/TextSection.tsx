import { IconProp } from "@fortawesome/fontawesome-svg-core";
import './TextSection.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {ContentData, ContentLabels} from "../../labels/ContentLabels";
import Wings from "./Wings";
import {current} from "@reduxjs/toolkit";
import Utils from "../../utils/Utils";

export enum TextSectionPosition {
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

interface ContentBubbleProps {
    data: ContentData;
    sectionPosition: TextSectionPosition;
}


class TextSection extends React.Component<ContentBubbleProps> {
    private myRef: React.RefObject<HTMLDivElement>;

    constructor(props: ContentBubbleProps) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }

    componentDidUpdate(prevProps: Readonly<ContentBubbleProps>, prevState: Readonly<{}>, snapshot?: any) {
        setTimeout(() => {
            if (prevProps.data.description !== this.props.data.description) {
                this.updateDimensions();
            }
        });
    }

    private updateDimensions = () => {
        const currElement = this.myRef.current;
        if (Utils.isNotNull(currElement?.style)) {
            const parentElement = currElement?.parentElement;
            const parentHeightDiff = parentElement?.offsetHeight - currElement?.offsetHeight;
            currElement.style.margin = `${parentHeightDiff / 2}px 0`;
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

export default TextSection;

