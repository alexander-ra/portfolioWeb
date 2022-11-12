import React from 'react';
import {connect} from 'react-redux';
import './ChessPage.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Utils from '../../utils/Utils';
import {
    CastleInfo,
    ChessAiDifficulty,
    ChessLetters,
    ChessMove,
    ChessPiece,
    ChessPieceType,
    ChessSide,
    ChessSquare, ChessStartingSide,
    ChessUtils
} from "../../utils/ChessUtils";
import {ApiLichessUtils} from "../../utils/ApiLichessUtils";
import AppStorage, {StorageKey} from "../../utils/AppStorage";
import ChessGameConfigurator from "./ChessBoard/ChessConfigurator/ChessGameConfigurator";
import {faSquareXmark, faXmark, faXmarkSquare} from '@fortawesome/free-solid-svg-icons';
import {ChessBoardModel} from "../../reducers/chessBoard/chessBoardReducer";
import ChessBoardLetters from "./ChessBoard/ChessBoardLetters";
import ChessPromotionPopup from "./ChessBoard/ChessPromotionPopup";
import ChessPlayers from "./ChessBoard/ChessBoardPlayers";
import ChessBoard from "./ChessBoard/ChessBoard";

interface ChessPageProps {
    isClosing: boolean;
    chessGameId: number;
    playerSide: ChessSide;
    chessMoves: ChessMove[];
    gameEnded: boolean;
    chessPieces: ChessPiece[];
    castleInfo: CastleInfo;
    sideInCheck: ChessSide;
}

class ChessPage extends React.Component<ChessPageProps> {

    render(){
        return (
        <div className={`chess-page-wrapper ${this.props.isClosing ? "closing" : ""}`}>
            <ChessBoard />
            <button className={`game-end`} onClick={() => {ApiLichessUtils.resignGame()}}>
                <span>End game </span>
                <FontAwesomeIcon icon={faXmark} />
            </button>
        </div>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { gameId, playerSide, chessMoves, gameEnded } = state.chessReducer;
        const { chessPieces, castleInfo, sideInCheck } = state.chessBoardReducer as ChessBoardModel;
        return {
            ...ownProps,
            chessGameId: gameId,
            playerSide,
            chessMoves,
            gameEnded,
            chessPieces,
            castleInfo,
            sideInCheck
        }
    })(ChessPage);
