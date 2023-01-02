import React from 'react';
import Utils from '../../../utils/Utils';
import "./Icon.scss"
import {IconType} from "../../../models/common/IconType";

interface IconProps {
    icon: IconType;
    className?: string;
}

class Icon extends React.Component<IconProps> {

    render(){
        return (
            <div className={`icon ${this.props.icon} ${Utils.isNotNull(this.props.className) ? this.props.className : ""}`}/>
        )
    }
}

export default Icon;
