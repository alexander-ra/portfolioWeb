import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { CubeMenuStates } from '../../../models/landing/CubeMenuStates';
import './CubeWall.scss';

interface CubeWallProps {
    menu: CubeMenuStates;
    selected: boolean;
    onSelect: (menu: CubeMenuStates) => void;
    icon: IconProp;
    isClosing: boolean;
}

export interface CubeWallState {
    cubeDragClass?: string;
    selectedMenuState: CubeMenuStates;
}

class CubeWall extends React.Component<CubeWallProps, CubeWallState> {


    render(){
        return (
            <div className={`wall wall-${this.props.menu.toString().toLowerCase().replace("_", "-")} ${this.props.selected ? "selected" : ""} ${this.props.isClosing ? "closing" : ""}`}
                 onClick={() => {this.props.onSelect(this.props.menu)}}>
                <div className={"wall-content"}>
                    <FontAwesomeIcon className={"wall-icon"} icon={this.props.icon} />
                </div>
            </div>
        )
    }
}

export default CubeWall;
