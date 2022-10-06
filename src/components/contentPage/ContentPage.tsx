import React from 'react';
import './ContentPage.scss';
import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {LandingDescriptions} from "../../labels/LandingLabels";
import {connect} from 'react-redux';

interface ContentPageProps {
    isClosing: boolean;
}

interface ContentPageState {
    chosenIndex: number;
}


class ContentPage extends React.Component<ContentPageProps, ContentPageState> {
    constructor(props: ContentPageProps) {
        super(props);

        this.state = {
            chosenIndex: 0
        };
    }

    render(){
        return (<div className={`content-page-wrapper ${this.props.isClosing ? "closing" : ""}`}>
            <div className={"content-header-wrapper"}>
                <div className={"content-header"}>Past Experience</div>
            </div>
            <div className={"content-body"}>
                <div className={"circle"}>asd</div>
                <div className={"content-body-text"}>
                    <div className={`section section-two ${this.state.chosenIndex === 1 ? "section-chosen" : ""}`}>
                        <div className={"section-title"}>
                            <div>By position</div>
                        </div>
                    </div>
                    <div className={`section section-three ${this.state.chosenIndex === 2 ? "section-chosen" : ""}`}>
                        <div className={"section-title"}>
                            <div>By field</div>
                        </div>
                    </div>
                    <div className={`section section-four ${this.state.chosenIndex === 3 ? "section-chosen" : ""}`}>
                        <div className={"section-title"}>
                            <div>By framework</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
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
)(ContentPage);

