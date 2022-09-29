import React from 'react';
import './CommonBubble.scss';
import {LandingDescriptions} from '../../../labels/LandingLabels';
import Typewriter from '../../common/Typewriter';
import {CubeMenuStates} from "../../../models/landing/CubeMenuStates";

interface MenuBubbleProps {
    textBubbleType: CubeMenuStates;
    visible: boolean;
}

interface MenuBubbleState {
    menuDescription: string;
}


class MenuBubble extends React.Component<MenuBubbleProps, MenuBubbleState> {

    constructor(props: MenuBubbleProps) {
        super(props);

        this.state = {
            menuDescription: ""
        }
    }

    componentDidUpdate(prevProps: MenuBubbleProps) {
        if (this.props.textBubbleType !== prevProps.textBubbleType) {
            if (prevProps.textBubbleType === CubeMenuStates.NONE) {
                this.setDescription(this.props.textBubbleType);
            } else {
                setTimeout(() => {
                    this.setDescription(this.props.textBubbleType);
                }, 500)
            }
        }
    }

    setDescription(bubbleType?: CubeMenuStates) {
        switch (this.props.textBubbleType) {
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
            <div className={`menu-bubble-wrapper bubble-wrapper ${this.props.visible ? "disappear" : ""}`}>
                    <div className={"menu-bubble bubble"}>
                        <div className={"avatar-wrapper"}>
                            <div className={`avatar-icon ${this.props.textBubbleType}`}></div>
                            <div className={"avatar-name"}>
                                {this.props.textBubbleType === CubeMenuStates.TOP_LEFT && <span>Client Approach</span>}
                                {this.props.textBubbleType === CubeMenuStates.TOP_RIGHT && <span>Past Experience</span>}
                                {this.props.textBubbleType === CubeMenuStates.BOTTOM && <span>Chess Demo</span>}
                            </div>
                        </div>
                        <div className={"bubble-text"}>
                            {this.state.menuDescription}
                        </div>
                        <button className={"go-page"}>Launch Page</button>
                    </div>
            </div>
        </>
        )
    }
}

export default MenuBubble;

