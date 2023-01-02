import React from 'react';
import './ChessEndButton.scss';
import {CommonLabels} from "../../../provision/CommonLabels";
import { ApiLichessUtils } from '../../../utils/ApiLichessUtils';
import { IconType } from '../../../models/common/IconType';
import Icon from '../../common/Icon/Icon';

/**
 * ChessEndButton component. Button that can close the current chess session.
 *
 * @author Alexander Andreev
 */
class ChessEndButton extends React.Component {

    render(){
        return (
            <button className={`game-end`} onClick={() => {ApiLichessUtils.resignGame()}}>
                <span>{CommonLabels.END_GAME} </span>
                <Icon  icon={IconType.faXmark} />
            </button>)
    }
}

export default ChessEndButton;
