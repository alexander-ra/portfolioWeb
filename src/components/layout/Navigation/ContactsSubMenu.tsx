import React, {CSSProperties} from 'react';
import './ContactsSubMenu.scss';
import store from "../../../reducers/store";
import Icon from "../../common/Icon/Icon";
import { IconType } from '../../../models/common/IconType';
import { CommonLabels } from '../../../provision/CommonLabels';
import { Links } from '../../../provision/Links';

interface ExpandedMenuProps {
    isCard?: boolean;
    additionalStyle?: CSSProperties;
}

/**
 * NavigationSubMenu component. This component is responsible for displaying the contact card.
 *
 * @author Alexander Andreev
 */
class NavigationSubMenu extends React.Component<ExpandedMenuProps> {

    render(){
        return (
            <div className={"contact-expanded-menu expanded-menu"}
                 id={this.props.isCard ? "contact-card" : ""}
                 style={this.props.additionalStyle}>
                <div className={"contact-left"}>
                    <div className={"avatar-icon"} />
                    <div className={"names"}>{CommonLabels.ALEXANDER_ANDREEV}</div>
                    <div className={"position"}>{CommonLabels.WEB_DEVELOPER}</div>
                </div>
                <div className={"contact-right"}>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faMobile} />
                        <div className={"expanded-menu-label"}>
                            <a href="tel:+359-885-654-188">
                                {CommonLabels.CONTACT_PHONE}
                            </a>
                        </div>
                    </div>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faEnvelope} />
                        <div className={"expanded-menu-label"}>
                            <a href="mailto:info@alexander-andreev.com">
                                {CommonLabels.CONTACT_EMAIL}
                            </a>
                        </div>
                    </div>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faLinkedin} />
                        <div className={"expanded-menu-label"}>
                            <a href={Links.LINKEDIN_PAGE} target="_blank">
                                {CommonLabels.CONTACT_LINKED_IN}
                            </a>
                        </div>
                    </div>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faGithubAlt} />
                        <div className={"expanded-menu-label"}>
                            <a href={Links.GITHUB_PAGE} target="_blank">
                                {CommonLabels.CONTACT_GIT_HUB}
                            </a>
                        </div>
                    </div>
                    <div className={"contact-line"}>
                        <Icon className={"contact-icon"} icon={IconType.faSave} />
                        <div className={"expanded-menu-label"}>
                            <a href={Links.PORTFOLIO_PAGE}
                               target="_blank" download="alexander-andreev-cv.pdf">
                                {CommonLabels.CONTACT_RESUME}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavigationSubMenu;