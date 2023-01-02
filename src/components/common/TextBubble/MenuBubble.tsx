import React, {CSSProperties} from 'react';
import './CommonBubble.scss';
import {LandingDescriptions} from '../../../labels/LandingLabels';
import Typewriter from '../Typewriter/Typewriter';
import {CubeMenuStates} from "../../../models/landing/CubeMenuStates";
import {connect} from "react-redux";
import {changePage} from "../../../reducers/stages/stagesAction";
import { Page } from '../../../models/common/Page';
import { IconType } from '../../../models/common/IconType';
import Icon from '../Icon/Icon';
import ContactsSubMenu from "../../layout/Navigation/ContactsSubMenu";

interface MenuBubbleProps {
    textBubbleType: CubeMenuStates;
    visible: boolean;
    changePage?: any;
}

interface MenuBubbleState {
    menuDescription: string;
    contactCardStyle: CSSProperties;
}


class MenuBubble extends React.Component<MenuBubbleProps, MenuBubbleState> {

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
                    window.open("https://www.google.com/", '_blank').focus();
                }

                if (this.state.menuDescription === LandingDescriptions.PAST_EXPERIENCE) {
                    fetch('http://192.168.8.30:3000/static/media/avatar-jpeg.fbeb0d852a7c4716f705.jpg')
                        .then(resp => resp.blob())
                        .then(blob => {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            // the filename you want
                            a.download = 'image.jpg';
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                        })
                        .catch(() => alert('oh no!'));
                }
            }
        }

        document.onmouseover = (event: any) => {
            const el = document.getElementById("contact-card");
            if (event.target.id === "link-text") {
                if (this.state.menuDescription === LandingDescriptions.CLIENT_APPROACH) {
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
                }, 1000)
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
                        {this.props.textBubbleType === CubeMenuStates.TOP_LEFT && <span>Client Approach</span>}
                        {this.props.textBubbleType === CubeMenuStates.TOP_RIGHT && <span>Past Experience</span>}
                        {this.props.textBubbleType === CubeMenuStates.BOTTOM && <span>Chess Demo</span>}
                    </div>
                </div>
                <div className={"menu-bubble bubble"}>
                    <div className={"bubble-text"} dangerouslySetInnerHTML={
                        {__html: this.state.menuDescription}
                    }>
                    </div>
                </div>
                <button className={"go-page"} onClick={this.changePage.bind(this)}>Launch Page</button>
                <ContactsSubMenu isCard={true} additionalStyle={this.state.contactCardStyle}/>
            </div>
        )
    }
}

export default connect(null, { changePage })(MenuBubble);

