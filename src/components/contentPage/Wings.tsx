import { IconProp } from "@fortawesome/fontawesome-svg-core";
import './Wings.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {ContentData, ContentLabels} from "../../labels/ContentLabels";
import { TextSectionPosition } from "./TextSection";

interface ContentBubbleProps {
    sectionPosition: TextSectionPosition;
}


class TextSection extends React.Component<ContentBubbleProps> {

    constructor(props: ContentBubbleProps) {
        super(props);
    }

    render(){
        return (
            <>
                <div className={`wing top-wing ${this.props.sectionPosition.toLowerCase()}-wing`}></div>
                <div className={`wing bottom-wing ${this.props.sectionPosition.toLowerCase()}-wing`}></div>
            </>
        )
    }
}

export default TextSection;

