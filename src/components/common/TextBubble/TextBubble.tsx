import React from 'react';
import './CommonBubble.scss';
import {LandingDescriptions} from '../../../provision/LandingLabels';
import Typewriter from '../Typewriter/Typewriter';
import {CubeMenuStates} from "../../../models/landing/CubeMenuStates";
import {connect} from "react-redux";
import {completeDevIntro} from "../../../reducers/stages/stagesAction";
import {CommonLabels} from "../../../provision/CommonLabels";

interface TextBubbleProps {
    visible: boolean;
    textToType: string;
    completeDevIntro: any;
    skipTyping: boolean;
}

interface TextBubbleState {
    menuDescription: LandingDescriptions;
}

/**
 * TextBubble component. This component is responsible for displaying initial message using typewriter effect.
 *
 * @author Alexander Andreev
 */
class TextBubble extends React.Component<TextBubbleProps, TextBubbleState> {
    private startedTyping: boolean = false;

    componentDidUpdate(prevProps: Readonly<TextBubbleProps>, prevState: Readonly<TextBubbleState>) {
        if (prevProps.visible !== this.props.visible) {
            this.setState({});
        }
    }

    render(){
        if (this.props.visible) {
            this.startedTyping = true;
        }
        return (
            <div className={`text-bubble-wrapper bubble-wrapper ${this.props.visible ? "" : "disappear"}`}>
                <div className={"text-bubble bubble"}>
                    {this.startedTyping &&
                        <Typewriter
                            textToType={this.props.textToType}
                            onCompleted={() => {this.props.completeDevIntro();}}
                            skipTyping={this.props.skipTyping}
                            boldLettersStart={this.props.textToType.indexOf("Give the cube")}
                            boldLettersEnd={this.props.textToType.indexOf(", or click")}/>
                    }
                </div>
                <div className={"avatar-wrapper"}>
                    <div className={"avatar-icon"}></div>
                    <div className={"avatar-name"}>
                        {CommonLabels.ALEX}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(null, { completeDevIntro })(TextBubble);
