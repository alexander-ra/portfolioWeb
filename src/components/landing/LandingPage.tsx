import React from 'react';
import './LandingPage.scss';
import Typewriter from "../common/Typewriter";
import LandingCube from "./cube/Cube";
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {LandingDescriptions} from "../../labels/LandingLabels";
import { connect } from 'react-redux';
import { openCube } from '../../utils/cubeAction';

interface LandingCubeProps {
    cubeOpened?: boolean;
}

interface LandingCubeState {
    selectedMenuState?: CubeMenuStates;
    menuDescription?: LandingDescriptions;
}


class LandingPage extends React.Component<LandingCubeProps, LandingCubeState> {
    constructor(props: LandingCubeProps) {
        super(props);

        this.state = {
            selectedMenuState: CubeMenuStates.NONE,
        };
    }

    componentDidUpdate(prevProps: LandingCubeProps, prevState: LandingCubeState) {
        // Typical usage (don't forget to compare props):
        if (this.state.selectedMenuState !== prevState.selectedMenuState) {
            if (prevState.selectedMenuState === CubeMenuStates.NONE) {
                this.setDescription(this.state.selectedMenuState);
            } else {
                setTimeout(() => {
                    this.setDescription(this.state.selectedMenuState);
                }, 500)
            }
        }
    }

    setDescription(selectedMenu?: CubeMenuStates) {
        switch (this.state.selectedMenuState) {
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


    render(){
        return (<>
            <div className={`text-bubble-wrapper bubble-wrapper ${this.props.cubeOpened ? "" : "disappear"}`}>
                <div className={"text-bubble bubble"}>
                    {this.props.cubeOpened &&
                        <Typewriter
                            textToType={"Hi. My name is Alex. I am web developer with a decade of experience in the field. With a focus in the past in front-end banking and web gaming solutions, I strive to deliver swift web apps with seamless interactiveness and impeccable security. Rotate the landing and select a page for more info. All code of this website is available in GIT, accessible is via the footer."}
                        />
                    }
                    <div className={"avatar-wrapper"}>
                        <div className={"avatar-icon"}></div>
                        <div className={"avatar-name"}>Alex</div>
                    </div>
                </div>
            </div>
            <div className={`menu-bubble-wrapper bubble-wrapper ${this.state.selectedMenuState === CubeMenuStates.NONE ? "disappear" : ""}`}>
                    <div className={"menu-bubble bubble"}>
                        <div className={"avatar-wrapper"}>
                            <div className={`avatar-icon ${this.state.selectedMenuState}`}></div>
                            <div className={"avatar-name"}>
                                {this.state.selectedMenuState === CubeMenuStates.TOP_LEFT && <span>Client Approach</span>}
                                {this.state.selectedMenuState === CubeMenuStates.TOP_RIGHT && <span>Past Experience</span>}
                                {this.state.selectedMenuState === CubeMenuStates.BOTTOM && <span>Chess Demo</span>}
                            </div>
                        </div>
                        <div className={"bubble-text"}>
                            {this.state.menuDescription}
                        </div>
                        <button className={"go-page"}>Launch Page</button>
                    </div>
            </div>
            <LandingCube />
        </>
        )
    }
}

export default connect(
    (state: any, ownProps) => {
        const { cubeOpened } = state.cubesReducer;
        return {
            ...ownProps,
            cubeOpened
        }
    },
    { openCube }
)(LandingPage);

