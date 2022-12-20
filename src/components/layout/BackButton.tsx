import React from 'react';
import './BackButton.scss';
import {connect} from "react-redux";
import {Page} from '../../models/common/Page';
import { changePage } from '../../reducers/stages/stagesAction';
import Icon from '../common/icon/Icon';
import { IconType } from '../common/icon/IconType';

interface BackButtonProps {
    changePage?: any;
    currentPage?: Page;
}

interface BackButtonState {
}

class BackButton extends React.Component<BackButtonProps, BackButtonState> {


    render(){
        return <>
            {this.props.currentPage !== Page.LANDING &&
                <div className={"back-button"} onClick={() => {this.props.changePage(Page.LANDING)}}>
                    <Icon className={"back-icon"} icon={IconType.faChevronLeft} />
                    <div className={"back-cube"}></div>
                </div>
            }
        </>
    }
}

export default connect((state: any, ownProps) => {
    const { currentPage } = state.stagesReducer;
    return {
        ...ownProps,
        currentPage
    }
}, { changePage })(BackButton);
