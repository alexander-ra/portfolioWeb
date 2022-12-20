import React from 'react';
import './NavigationSubMenu.scss';
import store from "../../store/store";
import Icon from '../common/icon/Icon';
import { IconType } from '../common/icon/IconType';

interface ExpandedMenuProps {
}

interface ExpandedMenuState {
}

class NavigationSubMenu extends React.Component<ExpandedMenuProps, ExpandedMenuState> {

    render(){
        return (
            <div className={"navigation-expanded-menu expanded-menu"}>
                <div className={"expanded-menu-item"}>
                    <Icon className={"expanded-menu-icon"} icon={IconType.faCube} />
                    <div className={"expanded-menu-label"}>Home</div>
                </div>
                <div className={"expanded-menu-item"}>
                    <Icon className={"expanded-menu-icon"} icon={IconType.faHandshake} />
                    <div className={"expanded-menu-label"}>Client Approach</div>
                </div>
                <div className={"expanded-menu-item"}>
                    <Icon className={"expanded-menu-icon"} icon={IconType.faSuitcase} />
                    <div className={"expanded-menu-label"}>Past Experience</div>
                </div>
                <div className={"expanded-menu-item"}>
                    <Icon className={"expanded-menu-icon"} icon={IconType.faChess} />
                    <div className={"expanded-menu-label"}>Chess Demo</div>
                </div>
            </div>
        )
    }
}

export default NavigationSubMenu;