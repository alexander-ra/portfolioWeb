import React from 'react';
import './CommonBubble.scss';
import {LandingDescriptions} from '../../../labels/LandingLabels';
import Typewriter from '../../common/Typewriter';
import {CubeMenuStates} from "../../../models/landing/CubeMenuStates";

interface TextBubbleProps {
    visible: boolean;
    textToType: string;
}

interface TextBubbleState {
    menuDescription: LandingDescriptions;

}


class TextBubble extends React.Component<TextBubbleProps, TextBubbleState> {

    render(){
        return (<>
            <div className={`text-bubble-wrapper bubble-wrapper ${this.props.visible ? "" : "disappear"}`}>
                <div className={"text-bubble bubble"}>
                    {this.props.visible &&
                        <Typewriter
                            textToType={this.props.textToType}
                        />
                    }
                    <div className={"avatar-wrapper"}>
                        <div className={"avatar-icon"}></div>
                        <div className={"avatar-name"}>
                            Alex
                        </div>
                    </div>
                </div>
            </div>
        </>
        )
    }
}

export default TextBubble;

