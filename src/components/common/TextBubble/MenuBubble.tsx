import React, {CSSProperties} from 'react';
import './CommonBubble.scss';
import {LandingDescriptions} from '../../../provision/LandingLabels';
import Typewriter from '../Typewriter/Typewriter';
import {CubeMenuStates} from "../../../models/landing/CubeMenuStates";
import {connect} from "react-redux";
import {changePage} from "../../../reducers/stages/stagesAction";
import { Page } from '../../../models/common/Page';
import { IconType } from '../../../models/common/IconType';
import Icon from '../Icon/Icon';
import ContactsSubMenu from "../../layout/Navigation/ContactsSubMenu";
import { CommonLabels } from '../../../provision/CommonLabels';
import { Links } from '../../../provision/Links';

interface MenuBubbleProps {
    textBubbleType: CubeMenuStates;
    visible: boolean;
    changePage?: any;
}

interface MenuBubbleState {
    menuDescription: string;
    contactCardStyle: CSSProperties;
}

/**
 * MenuBubble component. This component is responsible for displaying additional information about each cube section.
 *
 * @author Alexander Andreev
 */
class MenuBubble extends React.Component<MenuBubbleProps, MenuBubbleState> {
    private readonly MENU_CLOSING_TIMEOUT = 1000;

    constructor(props: MenuBubbleProps) {
        super(props);

        this.state = {
            menuDescription: "",
            contactCardStyle: {
                visibility: "hidden"
            }
        }
    }

    componentDidMount() {
        document.onclick = (event: any) => {
            if (event.target.id === "link-text") {

                if (this.state.menuDescription === LandingDescriptions.CHESS_DEMO) {
                    // Open GitHub page in new tab
                    window.open(Links.GITHUB_PAGE, '_blank').focus();
                }

                if (this.state.menuDescription === LandingDescriptions.PAST_EXPERIENCE) {
                    // Download CV
                    fetch(Links.PORTFOLIO_PAGE)
                        .then(resp => resp.blob())
                        .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = 'image.jpg';
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                        })
                        .catch(() => alert('Cannot download file!'));
                }
            }
        }

        document.onmouseover = (event: any) => {
            const el = document.getElementById("contact-card");
            if (event.target.id === "link-text") {
                if (this.state.menuDescription === LandingDescriptions.CLIENT_APPROACH) {
                    // Show contact card and set its position relative to the cursor
                    const top = event.target.getBoundingClientRect().bottom - el.getBoundingClientRect().height - 10;
                    let left = event.clientX - el.getBoundingClientRect().width / 2;

                    if (left + el.getBoundingClientRect().width > window.innerWidth) {
                        left = window.innerWidth - el.getBoundingClientRect().width;
                    } else if (left < 0) {
                        left = 0;
                    }

                    this.setState({
                        contactCardStyle: {
                            top: `${top}px`,
                            left: `${left}px`
                        }
                    })

                }
            } else if (!el.contains(event.target)) {
                this.setState({
                    contactCardStyle: {
                        visibility: "hidden"
                    }
                })
            }
        }
    }

    componentWillUnmount() {
        document.onclick = null;
        document.onmouseover = null;
    }

    componentDidUpdate(prevProps: MenuBubbleProps) {
        if (this.props.textBubbleType !== prevProps.textBubbleType) {
            if (this.props.textBubbleType !== CubeMenuStates.NONE) {
                this.setDescription(this.props.textBubbleType);

            } else {
                setTimeout(() => {
                    this.setDescription(this.props.textBubbleType);
                }, this.MENU_CLOSING_TIMEOUT);
            }
        }
    }

    setDescription(bubbleType?: CubeMenuStates) {
        switch (this.props.textBubbleType) {
            case CubeMenuStates.TOP_RIGHT:
                this.setState({menuDescription: LandingDescriptions.PAST_EXPERIENCE});
                break;
            case CubeMenuStates.TOP_LEFT:
                this.setState({menuDescription: LandingDescriptions.CLIENT_APPROACH});
                break;
            case CubeMenuStates.BOTTOM:
                this.setState({menuDescription: LandingDescriptions.CHESS_DEMO});
                break;
        }
    }


    changePage(): void {
        let pageToChange = Page.LANDING;
        switch (this.props.textBubbleType) {
            case CubeMenuStates.BOTTOM:
                pageToChange = Page.CHESS_DEMO;
                break;
            case CubeMenuStates.TOP_LEFT:
                pageToChange = Page.CLIENT_APPROACH;
                break;
            case CubeMenuStates.TOP_RIGHT:
                pageToChange = Page.PAST_EXPERIENCE;
                break;
        }
        this.props.changePage(pageToChange);
    }

    private getIcon(): IconType {
        switch (this.state.menuDescription) {
            case LandingDescriptions.CHESS_DEMO:
                return IconType.faChess;
            case LandingDescriptions.PAST_EXPERIENCE:
                return IconType.faSuitcase;
            case LandingDescriptions.CLIENT_APPROACH:
                return IconType.faHandshake;
        }

        return IconType.faHandshake;
    }

    render(){
        return (
            <div className={`menu-bubble-wrapper bubble-wrapper ${!this.props.visible ? "disappear" : ""}`}>
                <div className={"avatar-wrapper"}>
                    <div className={`avatar-icon-wrapper`}>
                        <Icon className={"avatar-icon"} icon={this.getIcon()}/>
                    </div>
                    <div className={"avatar-name"}>
                        {this.props.textBubbleType === CubeMenuStates.TOP_LEFT && <span>{CommonLabels.CLIENT_APPROACH}</span>}
                        {this.props.textBubbleType === CubeMenuStates.TOP_RIGHT && <span>{CommonLabels.PAST_EXPERIENCE}</span>}
                        {this.props.textBubbleType === CubeMenuStates.BOTTOM && <span>{CommonLabels.CHESS_DEMO}</span>}
                    </div>
                </div>
                <div className={"menu-bubble bubble"}>
                    <div className={"bubble-text"} dangerouslySetInnerHTML={
                        {__html: this.state.menuDescription}
                    }>
                    </div>
                </div>
                <button className={"go-page"} onClick={this.changePage.bind(this)}>{CommonLabels.LAUNCH_PAGE}</button>
                <ContactsSubMenu isCard={true} additionalStyle={this.state.contactCardStyle}/>
            </div>
        )
    }
}

export default connect(null, { changePage })(MenuBubble);

