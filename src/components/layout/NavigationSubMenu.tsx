import React from 'react';
import './NavigationSubMenu.scss';
import store from "../../store/store";
import {faGithubAlt} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChess, faCube, faHandshake, faSuitcase} from '@fortawesome/free-solid-svg-icons';

interface ExpandedMenuProps {
}

interface ExpandedMenuState {
}

class NavigationSubMenu extends React.Component<ExpandedMenuProps, ExpandedMenuState> {

    render(){
        return (
            <div className={"navigation-expanded-menu expanded-menu"}>
                <div className={"expanded-menu-item"}>
                    <FontAwesomeIcon className={"expanded-menu-icon"} icon={faCube} />
                    <div className={"expanded-menu-label"}>Home</div>
                </div>
                <div className={"expanded-menu-item"}>
                    <FontAwesomeIcon className={"expanded-menu-icon"} icon={faHandshake} />
                    <div className={"expanded-menu-label"}>Client Approach</div>
                </div>
                <div className={"expanded-menu-item"}>
                    <FontAwesomeIcon className={"expanded-menu-icon"} icon={faSuitcase} />
                    <div className={"expanded-menu-label"}>Past Experience</div>
                </div>
                <div className={"expanded-menu-item"}>
                    <FontAwesomeIcon className={"expanded-menu-icon"} icon={faChess} />
                    <div className={"expanded-menu-label"}>Chess Demo</div>
                </div>
            </div>
        )
    }
}

export default NavigationSubMenu;