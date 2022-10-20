import { IconProp } from "@fortawesome/fontawesome-svg-core";
import './TextSection.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {ContentData, ContentLabels} from "../../labels/ContentLabels";

export enum TextSectionPosition {
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

interface ContentBubbleProps {
    data: ContentData;
    sectionPosition: TextSectionPosition;
}


class TextSection extends React.Component<ContentBubbleProps> {

    constructor(props: ContentBubbleProps) {
        super(props);
    }

    render(){
        const { data } = this.props;
        return (
            <div className={`text-section text-section-${this.props.sectionPosition.toLowerCase()}`}>
                <div className="top-wing wing back-wing"></div>
                <div className={"content"}>
                    <FontAwesomeIcon className={`content-icon`} icon={data.icon}/>
                    <div className={"content-title"}>{data.title}</div>
                    <div className={"content-body"}>{data.description}</div>
                </div>
                <div className="middle-wing wing"></div>
                <div className="bottom-wing wing"></div>
            </div>
        )
    }
}

export default TextSection;

