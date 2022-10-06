import React from 'react';
import './BackButton.scss';
import {connect} from "react-redux";
import {Page} from '../../models/common/Page';
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { changePage } from '../../reducers/stages/stagesAction';

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
                    <FontAwesomeIcon className={"back-icon"} icon={faChevronLeft} />
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
