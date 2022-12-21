import React from 'react';
import './LandingPage.scss';
import LandingCube from "./cube/Cube";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {LandingDescriptions} from "../../labels/LandingLabels";
import {connect} from 'react-redux';
import TextBubble from "../common/text-bubble/TextBubble";
import MenuBubble from "../common/text-bubble/MenuBubble";
import { IconType } from '../common/icon/IconType';
import BrowserUtils from '../../utils/BrowserUtils';
import { ProvisionUtils } from '../../utils/ProvisionUtils';

interface LandingCubeProps {
    cubeOpened: boolean;
    selectedMenu: CubeMenuStates;
    isClosing: boolean;
    landingPageLeft: boolean;
}

interface LandingCubeState {
    isLoading: boolean;
}


class LandingPage extends React.Component<LandingCubeProps, LandingCubeState> {

    constructor(props: LandingCubeProps) {
        super(props);

        this.state = {
            isLoading: true,
        };
        BrowserUtils.loadResources(ProvisionUtils.landingResources())
        .then(() => {
            this.setState({isLoading: false});
        })
        .catch(() => {
            console.error('Error loading resources');
        });
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
            <LandingCube isCLosing={this.props.isClosing} isLoading={this.state.isLoading}/>
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

