import React from 'react';
import './LandingPage.scss';
import LandingCube from "./cube/Cube";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {LandingDescriptions} from "../../labels/LandingLabels";
import {connect} from 'react-redux';
import TextBubble from "../common/text-bubble/TextBubble";
import MenuBubble from "../common/text-bubble/MenuBubble";
import { IconType } from '../common/icon/IconType';
import image1 from "../../resources/categoryImages/chess/home.jpg";
import image2 from "../../resources/categoryImages/client/home.jpg";
import image3 from "../../resources/categoryImages/experience/home.jpg";

interface LandingCubeProps {
    cubeOpened: boolean;
    selectedMenu: CubeMenuStates;
    isClosing: boolean;
    landingPageLeft: boolean;
}

interface LandingCubeState {
    loadedImages: number;
}


class LandingPage extends React.Component<LandingCubeProps, LandingCubeState> {

    constructor(props: LandingCubeProps) {
        super(props);

        this.state = {
            loadedImages: 0,
        };
        const img1 = new Image();
        img1.src = image1;
        img1.onload = () => {
            this.setState({loadedImages: 1});
            img1.src = image2;
            img1.onload = () => {
                img1.src = image3;
                this.setState({loadedImages: 2});
                img1.onload = () => {
                    this.setState({loadedImages: 3});
                };
            };
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
            <LandingCube isCLosing={this.props.isClosing} isLoading={this.state.loadedImages < 3}/>
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

