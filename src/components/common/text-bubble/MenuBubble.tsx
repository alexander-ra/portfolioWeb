import React from 'react';
import './CommonBubble.scss';
import {LandingDescriptions} from '../../../labels/LandingLabels';
import Typewriter from '../Typewriter';
import {CubeMenuStates} from "../../../models/landing/CubeMenuStates";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {connect} from "react-redux";
import {changePage} from "../../../reducers/stages/stagesAction";
import { Page } from '../../../models/common/Page';

interface MenuBubbleProps {
    textBubbleType: CubeMenuStates;
    visible: boolean;
    icon: IconProp;
    changePage?: any;
}

interface MenuBubbleState {
    menuDescription: string;
}


class MenuBubble extends React.Component<MenuBubbleProps, MenuBubbleState> {

    constructor(props: MenuBubbleProps) {
        super(props);

        this.state = {
            menuDescription: ""
        }
    }

    componentDidUpdate(prevProps: MenuBubbleProps) {
        if (this.props.textBubbleType !== prevProps.textBubbleType) {
            if (prevProps.textBubbleType === CubeMenuStates.NONE) {
                this.setDescription(this.props.textBubbleType);
            } else {
                setTimeout(() => {
                    this.setDescription(this.props.textBubbleType);
                }, 500)
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

    render(){
        return (
            <div className={`menu-bubble-wrapper bubble-wrapper ${!this.props.visible ? "disappear" : ""}`}>
                <div className={"avatar-wrapper"}>
                    <div className={`avatar-icon-wrapper`}>
                        <FontAwesomeIcon className={"avatar-icon"} icon={this.props.icon}/>
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
            </div>
        )
    }
}

export default connect(null, { changePage })(MenuBubble);

