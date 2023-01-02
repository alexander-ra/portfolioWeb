import React, {CSSProperties} from 'react';
import './ContactsSubMenu.scss';
import store from "../../../reducers/store";
import Icon from "../../common/Icon/Icon";
import { IconType } from '../../../models/common/IconType';

interface ExpandedMenuProps {
    isCard?: boolean;
    additionalStyle?: CSSProperties;
}

interface ExpandedMenuState {
}

class NavigationSubMenu extends React.Component<ExpandedMenuProps, ExpandedMenuState> {

    render(){
        return (
            <div className={"contact-expanded-menu expanded-menu"}
                 id={this.props.isCard ? "contact-card" : ""}
                 style={this.props.additionalStyle}>
                <div className={"contact-left"}>
                    <div className={"avatar-icon"} />
                    <div className={"names"}>Alexander Andreev</div>
                    <div className={"position"}>WEB Developer</div>
                </div>
                <div className={"contact-right"}>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faMobile} />
                        <div className={"expanded-menu-label"}>
                            <a href="tel:+359-654-188">
                                (+359) 885-654-188
                            </a>
                        </div>
                    </div>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faEnvelope} />
                        <div className={"expanded-menu-label"}>
                            <a href="mailto:alexander.andreev37@gmail.com">
                                info@alexdev.pro
                            </a>
                        </div>
                    </div>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faLinkedin} />
                        <div className={"expanded-menu-label"}>
                            <a href="src/components/layout/Navigation/ContactsSubMenu" target="_blank">
                                /in/alexandar-andreev
                            </a>
                        </div>
                    </div>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faGithubAlt} />
                        <div className={"expanded-menu-label"}>
                            <a href="src/components/layout/Navigation/ContactsSubMenu" target="_blank">
                                alexander-ra/portfolioWeb
                            </a>
                        </div>
                    </div>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faSave} />
                        <div className={"expanded-menu-label"}>
                            <a href="http://192.168.8.30:3000/static/media/avatar-jpeg.fbeb0d852a7c4716f705.jpg"
                               target="_blank" download="image.jpg">
                                Download Resume.pdf
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavigationSubMenu;