import React from 'react';
import './LandingPage.scss';
import LandingCube from "./cube/Cube";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {LandingDescriptions} from "../../labels/LandingLabels";
import {connect} from 'react-redux';
import TextBubble from "./text-bubble/TextBubble";
import MenuBubble from "./text-bubble/MenuBubble";
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {faChessKnight, faHandshake, faSuitcase} from '@fortawesome/free-solid-svg-icons';

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

    private getIcon(): IconProp {
        switch (this.props.selectedMenu) {
            case CubeMenuStates.BOTTOM:
                return faChessKnight;
            case CubeMenuStates.TOP_RIGHT:
                return faSuitcase;
            case CubeMenuStates.TOP_LEFT:
                return faHandshake;
        }

        return faHandshake;
    }

    render(){
        return (<>
            <TextBubble visible={this.props.cubeOpened}
                        textToType={LandingDescriptions.DEVELOPER_INTRODUCTION} />
            <MenuBubble textBubbleType={this.props.selectedMenu}
                        visible={this.props.selectedMenu === CubeMenuStates.NONE}
                        icon={this.getIcon()}/>
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

