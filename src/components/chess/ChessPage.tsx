import React from 'react';
import {connect} from 'react-redux';
import './ChessPage.scss';
import Utils from '../../utils/Utils';
import {ApiLichessUtils} from "../../utils/ApiLichessUtils";
import StorageUtil, {StorageKey} from "../../utils/StorageUtil";
import ChessGameConfigurator from "./ChessConfigurator/ChessGameConfigurator";
import {ChessBoardModel} from "../../reducers/chessBoard/chessBoardReducer";
import ChessBoardLetters from "./ChessBoard/ChessBoardLetters/ChessBoardLetters";
import ChessPromotionPopup from "./ChessBoard/ChessPromotionPopup/ChessPromotionPopup";
import ChessPlayers from "./ChessBoard/ChessBoardPlayers/ChessBoardPlayers";
import ChessBoard from "./ChessBoard/ChessBoard";
import {ChessGameStatus} from "../../models/chess/ChessGameStatus";
import { ChessSide } from '../../models/chess/ChessSide';
import { ChessMove } from '../../models/chess/ChessMove';
import { ChessPiece } from '../../models/chess/ChessPiece';
import { ChessCastleInfo } from '../../models/chess/ChessCastleInfo';
import {IconType} from "../../models/common/IconType";
import Icon from '../common/Icon/Icon';
import ChessEndButton from "./ChessEndButton/ChessEndButton";

interface ChessPageProps {
    chessGameId: number;
    playerSide: ChessSide;
    chessMoves: ChessMove[];
    gameStatus: ChessGameStatus;
    chessPieces: ChessPiece[];
    castleInfo: ChessCastleInfo;
    sideInCheck: ChessSide;
}

/**
 * ChessPage component. This component is responsible for displaying all chess related content.
 *
 * @author Alexander Andreev
 */
class ChessPage extends React.Component<ChessPageProps> {

    render(){
        return (
        <div className={`chess-page-wrapper`}>
            <ChessBoard />
            {this.props.gameStatus === ChessGameStatus.IN_PROGRESS &&
                <ChessEndButton />
            }
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
