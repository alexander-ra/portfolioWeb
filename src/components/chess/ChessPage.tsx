import React from 'react';
import {connect} from 'react-redux';
import './ChessPage.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Utils from '../../utils/Utils';
import {
    ChessAiDifficulty,
    ChessLetters,
    ChessMove,
    ChessPiece,
    ChessSide,
    ChessSquare,
    ChessUtils
} from "../../utils/ChessUtils";
import {ApiLichessUtils} from "../../utils/ApiLichessUtils";
import AppStorage, {StorageKey} from "../../utils/AppStorage";

interface LandingCubeProps {
    isClosing: boolean;
    chessGameId: number;
    playerSide: ChessSide;
    chessMoves: ChessMove[];
}

interface LandingCubeState {
    boardPieces: ChessPiece[];
    squareFrom: ChessSquare | null;
}

class ChessPage extends React.Component<LandingCubeProps, LandingCubeState> {
    private boardPieces: ChessPiece[] = [];
    private processedMoves: number = 0;

    constructor(props: LandingCubeProps) {
        super(props);
        this.state = {
            boardPieces: [],
            squareFrom: null,
        };

        if (Utils.isNull(this.props.chessGameId)) {
            const savedGameId = AppStorage.getStorage(StorageKey.CHESS_GAME_ID);
            if (Utils.isNotNull(savedGameId)) {
                ApiLichessUtils.getUpdatesForGame(savedGameId);
            }
        }

        this.boardPieces = ChessUtils.getInitialBoardPieces();
        this.changeBoard(this.props.chessMoves);
        if (Utils.isNotNull(this.props.chessGameId)) {
            ApiLichessUtils.getUpdatesForGame(this.props.chessGameId);
        }
    }

    componentDidUpdate(prevProps: Readonly<LandingCubeProps>, prevState: Readonly<LandingCubeState>, snapshot?: any) {
        if (prevProps.chessMoves.length !== this.props.chessMoves.length) {
            this.changeBoard(this.props.chessMoves);
        }
    }

    crateNewGame(): void {
        ApiLichessUtils.getNewGame(ChessAiDifficulty.EASY, ChessSide.WHITE);
    }

    changeBoard(moves: ChessMove[]): void {
        if (Utils.isArrayNotEmpty(moves)) {
            while (this.processedMoves < moves.length) {
                this.processMove(moves[this.processedMoves]);
            }
        }
    }

    processMove(move: ChessMove): void {
        let i = this.processedMoves;
        const movingPieceIndex = this.boardPieces.findIndex((pieceToMove) => {
            return ChessUtils.chessSquaresEqual(move.from, pieceToMove.square);
        })
        const deadPieceIndex = this.boardPieces.findIndex((pieceToRemove) => {
            return ChessUtils.chessSquaresEqual(move.to, pieceToRemove.square);
        })
        if (deadPieceIndex !== -1) {
            this.boardPieces[deadPieceIndex].square.row = 200; //TODO delete dead piece
        }
        if (movingPieceIndex !== -1) {
            this.boardPieces[movingPieceIndex].square = move.to;
            this.processedMoves++;
        } else {
            //TODO: throw err;
        }

        this.setState({boardPieces: []} );
    }

    clickSquare(square: ChessSquare): void {
        if (Utils.isNotNull(this.state.squareFrom)) {
            if (this.state.squareFrom?.row === square.row && this.state.squareFrom?.col === square.col) {
                this.setState({squareFrom: null});
            } else {
                const move = {
                    from: this.state.squareFrom ? this.state.squareFrom : {row: 1, col: ChessLetters.A}, //TODO fix this ugly
                    to: square
                };

                ApiLichessUtils.makeMove(move);
            }
        } else {
            this.setState({squareFrom: square})
        }
    }

    rednderChessBoard(): JSX.Element[] {
        const chessRows: JSX.Element[] = [];
        for (let row = 1; row <= 8; row++) {
            let chessRow: JSX.Element[] = [];
            for (let col = 1; col <= 8; col++) {
                const pieceIndex = this.boardPieces.findIndex((piece: ChessPiece) => {
                    return piece.square.col === col && piece.square.row === row;
                })
                chessRow.push(<div className={`chess-square chess-square-${(row + col) % 2 === 0 ? "black" : "white"} 
                ${this.state.squareFrom?.row === row && this.state.squareFrom?.col === col ? "clicked-square" : ""}`}
                                   onClick={() => {this.clickSquare({col,row})}}>
                    { pieceIndex !== -1 && <div className={`chess-piece chess-piece-${this.boardPieces[pieceIndex].side.toLowerCase()}`}>
                        <FontAwesomeIcon className={"back-icon"} icon={ChessUtils.getPieceIcon(this.boardPieces[pieceIndex].type)} />
                    </div>

                    }
                </div>);
            }
            chessRows.push(<div className={`chess-row`}>
                {chessRow}
            </div>
            );
        }
        return chessRows;
    }

    rednderBoardLetters(): JSX.Element[] {
        const boardLettersTop: JSX.Element[] = [];
        const boardLettersRight: JSX.Element[] = [];
        const boardLettersDown: JSX.Element[] = [];
        const boardLettersLeft: JSX.Element[] = [];
        for (let letterIndex = 1; letterIndex <= 8; letterIndex++) {
            boardLettersTop.push(<div className={`chess-letter chess-letter-top chess-letter-${ChessLetters[letterIndex]}`}>{ChessLetters[letterIndex]}</div>);
            boardLettersRight.push(<div className={`chess-letter chess-letter-right chess-letter-${letterIndex}`}>{letterIndex}</div>);
            boardLettersDown.push(<div className={`chess-letter chess-letter-bottom chess-letter-${ChessLetters[letterIndex]}`}>{ChessLetters[letterIndex]}</div>);
            boardLettersLeft.push(<div className={`chess-letter chess-letter-left chess-letter-${letterIndex}`}>{letterIndex}</div>);
        }
        return [
            <div className={`chess-letters chess-letters-top`}>{boardLettersTop}</div>,
            <div className={`chess-letters chess-letters-right`}>{boardLettersRight}</div>,
            <div className={`chess-letters chess-letters-bottom`}>{boardLettersDown}</div>,
            <div className={`chess-letters chess-letters-left`}>{boardLettersLeft}</div>];
    }

    render(){
        return (<div className={`chess-page-wrapper ${this.props.isClosing ? "closing" : ""}`}>
            <div className={`chess-board-wrapper ${this.props.playerSide.toLowerCase()}-player-view`}>
                {!this.props.chessGameId && <button onClick={this.crateNewGame}>
                    Play chess
                </button>}
                {this.props.chessGameId && <>
                    {this.rednderChessBoard()}
                    {this.rednderBoardLetters()}
                </>}
            </div>
        </div>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { gameId, opponentLevel, playerSide, chessMoves } = state.chessReducer;
        return {
            ...ownProps,
            chessGameId: gameId,
            opponentLevel,
            playerSide,
            chessMoves
        }
    })(ChessPage);

