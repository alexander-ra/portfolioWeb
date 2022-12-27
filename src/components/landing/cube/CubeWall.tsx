import React from 'react';
import { CubeMenuStates } from '../../../models/landing/CubeMenuStates';
import Icon from '../../common/icon/Icon';
import { IconType } from '../../common/icon/IconType';
import './CubeWall.scss';

interface CubeWallProps {
    menu: CubeMenuStates;
    selected: boolean;
    onSelect: (menu: CubeMenuStates) => void;
    icon: IconType;
}

export interface CubeWallState {
    selectedMenuState: CubeMenuStates;
}

class CubeWall extends React.Component<CubeWallProps, CubeWallState> {


    render(){
        return (
            <div className={`wall wall-${this.props.menu.toString().toLowerCase().replace("_", "-")} ${this.props.selected ? "selected" : ""}`}
                 onClick={() => {this.props.onSelect(this.props.menu)}}
                >
                <div className={"wall-content"}>

                    <Icon className={"wall-icon"} icon={this.props.icon} />
                </div>
            </div>
        )
    }
}

export default CubeWall;
