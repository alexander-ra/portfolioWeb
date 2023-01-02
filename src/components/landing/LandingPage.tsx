import React from 'react';
import './LandingPage.scss';
import LandingCube from "./Cube/Cube";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {LandingDescriptions} from "../../labels/LandingLabels";
import {connect} from 'react-redux';
import TextBubble from "../common/TextBubble/TextBubble";
import MenuBubble from "../common/TextBubble/MenuBubble";
import { IconType } from '../../models/common/IconType';
import BrowserUtils from '../../utils/BrowserUtils';
import { ProvisionUtils } from '../../utils/ProvisionUtils';
import img1 from "../../../public/resources/categoryImages/chess/home.jpg";
import img2 from "../../../public/resources/categoryImages/client/home.jpg";
import img3 from "../../../public/resources/categoryImages/experience/home.jpg";
import {Page} from "../../models/common/Page";
import {WindowUtils} from "../../utils/WindowUtils";
import store from "../../reducers/store";
import {changePage} from "../../reducers/stages/stagesAction";
import {openCube, selectMenu} from "../../reducers/cube/cubeAction";

interface LandingCubeProps {
    cubeOpened: boolean;
    selectedMenu: CubeMenuStates;
    landingPageLeft: boolean;
    selectMenu?: (menu: CubeMenuStates) => void;
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

        this.props.selectMenu(CubeMenuStates.NONE);
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
        return (<div className={`landing-page-wrapper`}>
            <TextBubble visible={this.props.cubeOpened}
                        textToType={LandingDescriptions.DEVELOPER_INTRODUCTION}
                        skipTyping={this.props.landingPageLeft}/>
            <LandingCube isLoading={this.state.isLoading}/>
            <MenuBubble textBubbleType={this.props.selectedMenu}
                        visible={this.props.selectedMenu !== CubeMenuStates.NONE}/>
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
    }, { selectMenu }
)(LandingPage);

