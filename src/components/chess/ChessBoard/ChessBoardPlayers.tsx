import React from 'react';
import {connect} from 'react-redux';
import { ChessAiDifficulty } from '../../../models/chess/ChessAiDifficulty';
import { ChessSide } from '../../../models/chess/ChessSide';
import { ChessStartingSide } from '../../../models/chess/ChessStartingSide';
import './ChessBoardPlayers.scss';

interface ChessPlayersProps {
    playerSide: ChessSide;
    sideInTurn: ChessSide;
    opponentLevel: ChessAiDifficulty;
    playerAvatar: ChessStartingSide;
}

class ChessBoardPlayers extends React.Component<ChessPlayersProps> {
    private readonly PLAYER_NAMES: string[] = ["Player", "Opponent"];

    rednderBoardLetters(): JSX.Element[] {
        const playerWindows: JSX.Element[] = [];
        this.PLAYER_NAMES.forEach((name, index) => {
           const isInTurn = index === 0 ? this.props.playerSide === this.props.sideInTurn : this.props.playerSide !== this.props.sideInTurn;
           const avatarType = index === 0 ? this.props.playerAvatar?.toLowerCase() : this.props.opponentLevel?.toLowerCase();
           playerWindows.push(
               <div className={`player-window-wrapper ${this.PLAYER_NAMES[index].toLowerCase()} ${isInTurn ? "active" : ""}`}>
                   <div className={`avatar avatar-${avatarType}`}>
                       <div className={`avatar-label`}>{`${this.PLAYER_NAMES[index]}${isInTurn ? "'s turn" : " waiting"}`}</div>
                   </div>
               </div>
           )
        });
        return playerWindows;
    }

    render(){
        return (<>{this.rednderBoardLetters()}</>)
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

