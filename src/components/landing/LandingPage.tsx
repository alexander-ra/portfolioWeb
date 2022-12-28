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
import img1 from "../../../public/resources/categoryImages/chess/home.jpg";
import img2 from "../../../public/resources/categoryImages/client/home.jpg";
import img3 from "../../../public/resources/categoryImages/experience/home.jpg";
import {Page} from "../../models/common/Page";
import {WindowUtils} from "../../utils/WindowUtils";
import store from "../../store/store";
import {changePage} from "../../reducers/stages/stagesAction";
import {openCube} from "../../reducers/cube/cubeAction";

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
    }

    componentDidMount() {
        BrowserUtils.loadResources(ProvisionUtils.landingResources())
            .then(() => {
                this.setState({isLoading: false});

                const page: Page = WindowUtils.getPageFromURL();
                if (page !== Page.LANDING) {
                    store.dispatch(changePage(page));

                    if (!store.getState().cubesReducer.cubeOpened) {
                        store.dispatch(openCube());
                    }
                }
            })
            .catch(() => {
                console.error('Error loading resources');
            });
    }

    render(){
        return (<div className={`landing-page-wrapper ${this.props.isClosing ? "closing" : ""}`}>
            <TextBubble visible={this.props.cubeOpened && !this.props.isClosing}
                        textToType={LandingDescriptions.DEVELOPER_INTRODUCTION}
                        skipTyping={this.props.landingPageLeft}/>
            <LandingCube isCLosing={this.props.isClosing} isLoading={this.state.isLoading}/>
            <MenuBubble textBubbleType={this.props.selectedMenu}
                        visible={this.props.selectedMenu !== CubeMenuStates.NONE && !this.props.isClosing}/>
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

