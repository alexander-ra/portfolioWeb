import React from 'react';
import './ContactsSubMenu.scss';
import store from "../../store/store";
import Icon from "../common/icon/Icon";
import { IconType } from '../common/icon/IconType';

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
                        <Icon className={"contact-icon"} icon={IconType.faMobile} />
                        <div className={"expanded-menu-label"}>(+359) 885-654-188</div>
                    </div>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faEnvelope} />
                        <div className={"expanded-menu-label"}>info@alexdev.pro</div>
                    </div>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faLinkedin} />
                        <div className={"expanded-menu-label"}>/in/alexandar-andreev</div>
                    </div>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faGithubAlt} />
                        <div className={"expanded-menu-label"}>alexander-ra/portfolioWeb</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavigationSubMenu;