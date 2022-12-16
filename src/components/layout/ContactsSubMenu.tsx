import React from 'react';
import './ContactsSubMenu.scss';
import store from "../../store/store";
import {faGithubAlt, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChess, faCube, faEnvelope, faHandshake, faMobile, faSuitcase} from '@fortawesome/free-solid-svg-icons';

interface ExpandedMenuProps {
}

interface ExpandedMenuState {
}

class NavigationSubMenu extends React.Component<ExpandedMenuProps, ExpandedMenuState> {

    render(){
        return (
            <div className={"contact-expanded-menu expanded-menu"}>
                <div className={"contact-left"}>
                    <div className={"avatar-icon"} />
                    <div className={"names"}>Alexander Andreev</div>
                    <div className={"position"}>WEB Developer</div>
                </div>
                <div className={"contact-right"}>
                    <div className={"contact-line"}>
                        <FontAwesomeIcon className={"contact-icon"} icon={faMobile} />
                        <div className={"expanded-menu-label"}>(+359) 885-654-188</div>
                    </div>
                    <div className={"contact-line"}>
                        <FontAwesomeIcon className={"contact-icon"} icon={faEnvelope} />
                        <div className={"expanded-menu-label"}>info@alexdev.pro</div>
                    </div>
                    <div className={"contact-line"}>
                        <FontAwesomeIcon className={"contact-icon"} icon={faLinkedin} />
                        <div className={"expanded-menu-label"}>/in/alexandar-andreev</div>
                    </div>
                    <div className={"contact-line"}>
                        <FontAwesomeIcon className={"contact-icon"} icon={faGithubAlt} />
                        <div className={"expanded-menu-label"}>alexander-ra/portfolioWeb</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavigationSubMenu;