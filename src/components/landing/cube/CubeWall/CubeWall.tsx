import React from 'react';
import { CubeMenuStates } from '../../../../models/landing/CubeMenuStates';
import Icon from '../../../common/Icon/Icon';
import { IconType } from '../../../../models/common/IconType';
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

/**
 * CubeWall component. This component is responsible for displaying a wall of the cube.
 *
 * @author Alexander Andreev
 */
class CubeWall extends React.Component<CubeWallProps, CubeWallState> {

    render(){
        return (
            <div className={`wall wall-${this.props.menu.toString().toLowerCase().replace("_", "-")} ${this.props.selected ? "selected" : ""}`}
                 onClick={() => {this.props.onSelect(this.props.menu)}}
                 onTouchEnd={() => {this.props.onSelect(this.props.menu)}}
                >
                <div className={"wall-content"}>

                    <Icon className={"wall-icon"} icon={this.props.icon} />
                </div>
            </div>
        )
    }
}

export default CubeWall;
