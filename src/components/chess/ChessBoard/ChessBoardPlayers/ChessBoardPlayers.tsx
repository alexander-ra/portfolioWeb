import React from 'react';
import {connect} from 'react-redux';
import {ChessAiDifficulty} from '../../../../models/chess/ChessAiDifficulty';
import {ChessSide} from '../../../../models/chess/ChessSide';
import {ChessStartingSide} from '../../../../models/chess/ChessStartingSide';
import './ChessBoardPlayers.scss';
import {CommonLabels} from "../../../../provision/CommonLabels";

interface ChessPlayersProps {
    playerSide: ChessSide;
    sideInTurn: ChessSide;
    opponentLevel: ChessAiDifficulty;
    playerAvatar: ChessStartingSide;
}

/**
 * ChessBoardPlayers component. Represents the player/opponent elements next to the chess board.
 *
 * @author Alexander Andreev
 */
class ChessBoardPlayers extends React.Component<ChessPlayersProps> {
    private readonly PLAYER_NAMES: string[] = [CommonLabels.PLAYER, CommonLabels.COMPUTER];

    renderBoardPlayers(): JSX.Element[] {
        const playerWindows: JSX.Element[] = [];
        this.PLAYER_NAMES.forEach((name, index) => {
           const isInTurn = index === 0 ? this.props.playerSide === this.props.sideInTurn : this.props.playerSide !== this.props.sideInTurn;
           const avatarType = index === 0 ? this.props.playerAvatar?.toLowerCase() : this.props.opponentLevel?.toLowerCase();
           playerWindows.push(
               <div className={`player-window-wrapper ${this.PLAYER_NAMES[index].toLowerCase()} ${isInTurn ? "active" : ""}`} key={name}>
                   <div className={`avatar avatar-${avatarType}`}>
                       <div className={`avatar-label`}>
                           {`${this.PLAYER_NAMES[index]}${isInTurn ? CommonLabels.S_TURN : CommonLabels.WAITING}`}
                       </div>
                   </div>
               </div>
           )
        });
        return playerWindows;
    }

    render(){
        return (<>{this.renderBoardPlayers()}</>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { opponentLevel, playerSide, playerAvatar } = state.chessReducer;
        const { sideInTurn } = state.chessBoardReducer;
        return {
            ...ownProps,
            opponentLevel,
            playerSide,
            playerAvatar,
            sideInTurn,
        }
    })(ChessBoardPlayers);

