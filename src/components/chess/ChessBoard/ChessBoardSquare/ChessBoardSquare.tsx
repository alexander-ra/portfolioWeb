import React from 'react';
import {connect} from 'react-redux';
import './ChessBoardSquare.scss';
import Utils from '../../../../utils/Utils';
import {ChessUtils} from "../../../../utils/ChessUtils";
import {ApiLichessUtils} from "../../../../utils/ApiLichessUtils";
import StorageUtil, {StorageKey} from "../../../../utils/StorageUtil";
import ChessGameConfigurator from "../../ChessConfigurator/ChessGameConfigurator";
import {ChessBoardModel} from "../../../../reducers/chessBoard/chessBoardReducer";
import ChessBoardLetters from "../ChessBoardLetters/ChessBoardLetters";
import ChessPromotionPopup from "../ChessPromotionPopup/ChessPromotionPopup";
import ChessPlayers from "../ChessBoardPlayers/ChessBoardPlayers";
import { ChessSquare } from '../../../../models/chess/ChessSquare';
import { ChessPiece } from '../../../../models/chess/ChessPiece';
import { ChessMove } from '../../../../models/chess/ChessMove';
import { ChessSide } from '../../../../models/chess/ChessSide';
import { ChessPieceType } from '../../../../models/chess/ChessPieceType';
import Icon from '../../../common/Icon/Icon';

interface ChessBoardSquareProps {
    chessSquare: ChessSquare;
    chessPieces: ChessPiece[];
    chessMoves: ChessMove[];
    sideInCheck: ChessSide;
    selectedSquare: ChessSquare;
    possibleMoves: ChessSquare[];
    onClick: (square: ChessSquare) => any;
}

/**
 * ChessBoardSquare component. Represents a single square on the chess board.
 *
 * @author Alexander Andreev
 */
class ChessBoardSquare extends React.Component<ChessBoardSquareProps> {

    /**
     * Adds additional classes to the square, depending on the square's position and different conditions
     * @param square - the square to add classes to
     */
    getSquareAdditionalClasses(square: ChessSquare): string {
        let additionalClasses = `chess-square-${(square.row + square.col) % 2 === 0 ? "black" : "white"}`;

        if (ChessUtils.chessSquaresEqual(this.props.selectedSquare, square)) {
            additionalClasses = additionalClasses.concat(" clicked-square");
        }

        const lastMove = this.props.chessMoves[this.props.chessMoves.length - 1];
        if (Utils.isNotNull(lastMove)) {
            if (ChessUtils.chessSquaresEqual(square, lastMove.from)) {
                additionalClasses = additionalClasses.concat(" last-move-from")
            } else if (ChessUtils.chessSquaresEqual(square, lastMove.to)) {
                additionalClasses = additionalClasses.concat(" last-move-to")
            }
        }
        return additionalClasses;
    }

    /**
     *  Adds additional classes to the piece
     * @param square - the square where the piece is located
     * @param pieceIndex - the index of the piece in the chessPieces array
     */
    decorateSquare(square: ChessSquare, pieceIndex: number): JSX.Element {
        return <>
            {
                this.isPossibleMove(square) && <div className={`${pieceIndex !== -1 ? "possible-move-with-piece" : "possible-move"}`}></div>
            }
            {
                this.pieceInCheck(pieceIndex) && <div className={"king-piece-thread"}></div>
            }
        </>
    }

    /**
     * Checks if the piece is in check. Only kings can be in check.
     * @param pieceIndex - the index of the piece in the chessPieces array
     */
    pieceInCheck(pieceIndex: number): boolean {
        let inThread = false;
        if (Utils.isNotNull(this.props.sideInCheck) && pieceIndex !== -1 && this.props.chessPieces[pieceIndex].type === ChessPieceType.KING &&
            this.props.chessPieces[pieceIndex].side === this.props.sideInCheck) {
            inThread = true
        }
        return inThread;
    }

    /**
     * Checks if the square is a possible move for the selected piece
     * @param square - the square to check
     */
    isPossibleMove(square): boolean {
        return this.props.possibleMoves.findIndex((possibleMove: ChessSquare) => {
            return ChessUtils.chessSquaresEqual(square, possibleMove);
        }) !== -1;
    }

    /**
     * Checks if the square has a piece on it. If it does, it returns an icon representing the piece.
     * @param pieceIndex - the index of the piece in the chessPieces array
     */
    renderChessPiece(pieceIndex: number): JSX.Element {
        return <>
            { pieceIndex !== -1 && <div className={`chess-piece chess-piece-${this.props.chessPieces[pieceIndex].side.toLowerCase()}`}>
                <Icon icon={ChessUtils.getPieceIcon(this.props.chessPieces[pieceIndex].type)} />
            </div>
            }
        </>
    }

    render() {
        const square = this.props.chessSquare;
        const pieceIndex = this.props.chessPieces.findIndex((piece: ChessPiece) => {
            return ChessUtils.chessSquaresEqual(square, piece.square);
        })

        const additionalClasses = this.getSquareAdditionalClasses(square);
        return <div className={`chess-square ${additionalClasses}`}
                    onMouseDown={() => {this.props.onClick(square)}}
                    key={`${square.row}-${square.col}`}>
            {this.renderChessPiece(pieceIndex)}
            {this.decorateSquare(square, pieceIndex)}
        </div>;
    }

}

export default connect(
    (state: any, ownProps) => {
        const { gameId, playerSide, chessMoves, gameEnded } = state.chessReducer;
        const { chessPieces, sideInCheck } = state.chessBoardReducer as ChessBoardModel;
        return {
            ...ownProps,
            chessGameId: gameId,
            playerSide,
            chessMoves,
            gameEnded,
            chessPieces,
            sideInCheck
        }
    })(ChessBoardSquare);
