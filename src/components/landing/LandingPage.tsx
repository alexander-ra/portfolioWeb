import React from 'react';
import './LandingPage.scss';
import Typewriter from "../common/Typewriter";
import LandingCube from "./cube/Cube";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {LandingDescriptions} from "../../labels/LandingLabels";
import { connect } from 'react-redux';
import { openCube, selectMenu } from '../../utils/cubeAction';
import TextBubble from "./text-bubble/TextBubble";
import MenuBubble from "./text-bubble/MenuBubble";

interface LandingCubeProps {
    cubeOpened: boolean;
    selectedMenu: CubeMenuStates;
}


class LandingPage extends React.Component<LandingCubeProps> {
    constructor(props: LandingCubeProps) {
        super(props);

        this.state = {
            selectedMenuState: CubeMenuStates.NONE,
        };
    }

    render(){
        return (<>
            <TextBubble visible={this.props.cubeOpened} textToType={LandingDescriptions.DEVELOPER_INTRODUCTION} />
            <MenuBubble textBubbleType={this.props.selectedMenu} visible={this.props.selectedMenu === CubeMenuStates.NONE} />
            <LandingCube />
        </>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { cubeOpened, selectedMenu } = state.cubesReducer;
        return {
            ...ownProps,
            selectedMenu,
            cubeOpened
        }
    }
)(LandingPage);

