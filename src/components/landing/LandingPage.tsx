import React from 'react';
import './LandingPage.scss';
import LandingCube from "./cube/Cube";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {LandingDescriptions} from "../../labels/LandingLabels";
import {connect} from 'react-redux';
import TextBubble from "../common/text-bubble/TextBubble";
import MenuBubble from "../common/text-bubble/MenuBubble";
import { IconType } from '../common/icon/IconType';

interface LandingCubeProps {
    cubeOpened: boolean;
    selectedMenu: CubeMenuStates;
    isClosing: boolean;
    landingPageLeft: boolean;
}


class LandingPage extends React.Component<LandingCubeProps> {
    constructor(props: LandingCubeProps) {
        super(props);

        this.state = {
            selectedMenuState: CubeMenuStates.NONE,
        };
    }

    private getIcon(): IconType {
        switch (this.props.selectedMenu) {
            case CubeMenuStates.BOTTOM:
                return IconType.faChess;
            case CubeMenuStates.TOP_RIGHT:
                return IconType.faSuitcase;
            case CubeMenuStates.TOP_LEFT:
                return IconType.faHandshake;
        }

        return IconType.faHandshake;
    }

    render(){
        return (<div className={`landing-page-wrapper ${this.props.isClosing ? "closing" : ""}`}>
            <TextBubble visible={this.props.cubeOpened && !this.props.isClosing}
                        textToType={LandingDescriptions.DEVELOPER_INTRODUCTION}
                        skipTyping={this.props.landingPageLeft}/>
            <LandingCube isCLosing={this.props.isClosing}/>
            <MenuBubble textBubbleType={this.props.selectedMenu}
                        visible={this.props.selectedMenu !== CubeMenuStates.NONE && !this.props.isClosing}
                        icon={this.getIcon()}/>
        </div>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { cubeOpened, selectedMenu } = state.cubesReducer;
        const { landingPageLeft } = state.stagesReducer;
        return {
            ...ownProps,
            selectedMenu,
            cubeOpened,
            landingPageLeft
        }
    }
)(LandingPage);

