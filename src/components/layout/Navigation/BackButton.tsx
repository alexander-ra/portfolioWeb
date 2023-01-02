import React from 'react';
import './BackButton.scss';
import {connect} from "react-redux";
import {Page} from '../../../models/common/Page';
import { changePage } from '../../../reducers/stages/stagesAction';
import Icon from '../../common/Icon/Icon';
import { IconType } from '../../../models/common/IconType';
import {UIOrientation} from "../../../models/common/UIOrientation";

interface BackButtonProps {
    changePage?: any;
    uiOrientation: UIOrientation
}

interface BackButtonState {
}

class BackButton extends React.Component<BackButtonProps, BackButtonState> {


    render(){
        return <div className={"back-button"} onClick={() => {this.props.changePage(Page.LANDING)}}>
            <Icon className={"back-icon"} icon={IconType.faChevronLeft} />
            { this.props.uiOrientation !== UIOrientation.PORTRAIT && <div className={"back-cube"}></div> }
        </div>
    }
}

export default connect((state: any, ownProps) => {
    const { uiOrientation } = state.windowReducer;
    return {
        ...ownProps,
        uiOrientation
    }
}, { changePage })(BackButton);
