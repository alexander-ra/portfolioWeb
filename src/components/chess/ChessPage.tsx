import React from 'react';
import {connect} from 'react-redux';
import './ChessPage.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Utils from '../../utils/Utils';
import {ApiLichessUtils} from "../../utils/ApiLichessUtils";
import AppStorage, {StorageKey} from "../../utils/AppStorage";
import ChessGameConfigurator from "./ChessBoard/ChessConfigurator/ChessGameConfigurator";
import {faSquareXmark, faXmark, faXmarkSquare} from '@fortawesome/free-solid-svg-icons';
import {ChessBoardModel} from "../../reducers/chessBoard/chessBoardReducer";
import ChessBoardLetters from "./ChessBoard/ChessBoardLetters";
import ChessPromotionPopup from "./ChessBoard/ChessPromotionPopup";
import ChessPlayers from "./ChessBoard/ChessBoardPlayers";
import ChessBoard from "./ChessBoard/ChessBoard";
import {ChessGameStatus} from "../../models/chess/ChessGameStatus";
import { ChessSide } from '../../models/chess/ChessSide';
import { ChessMove } from '../../models/chess/ChessMove';
import { ChessPiece } from '../../models/chess/ChessPiece';
import { ChessCastleInfo } from '../../models/chess/ChessCastleInfo';

interface ChessPageProps {
    isClosing: boolean;
    chessGameId: number;
    playerSide: ChessSide;
    chessMoves: ChessMove[];
    gameStatus: ChessGameStatus;
    chessPieces: ChessPiece[];
    castleInfo: ChessCastleInfo;
    sideInCheck: ChessSide;
}

class ChessPage extends React.Component<ChessPageProps> {

    render(){
        return (
        <div className={`chess-page-wrapper ${this.props.isClosing ? "closing" : ""}`}>
            <ChessBoard />
            {this.props.gameStatus === ChessGameStatus.IN_PROGRESS &&
                <button className={`game-end`} onClick={() => {ApiLichessUtils.resignGame()}}>
                    <span>End game </span>
                    <FontAwesomeIcon icon={faXmark} />
                </button>}
        </div>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { gameId, playerSide, chessMoves, gameStatus } = state.chessReducer;
        const { chessPieces, castleInfo, sideInCheck } = state.chessBoardReducer as ChessBoardModel;
        return {
            ...ownProps,
            chessGameId: gameId,
            playerSide,
            chessMoves,
            gameStatus,
            chessPieces,
            castleInfo,
            sideInCheck
        }
    })(ChessPage);
