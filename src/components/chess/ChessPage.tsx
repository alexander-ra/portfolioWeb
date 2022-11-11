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
import ChessGameConfigurator from "./ChessGameConfigurator";
import {faSquareXmark, faXmark, faXmarkSquare} from '@fortawesome/free-solid-svg-icons';
import {ChessBoardModel} from "../../reducers/chessBoard/chessBoardReducer";

interface ChessPageProps {
    isClosing: boolean;
    chessGameId: number;
    playerSide: ChessSide;
    opponentSide: ChessSide;
    chessMoves: ChessMove[];
    gameEnded: boolean;
    opponentLevel: ChessAiDifficulty;
    playerAvatar: ChessStartingSide;
    chessPieces: ChessPiece[];
    sideInTurn: ChessSide;
    castleInfo: CastleInfo;
    sideInCheck: ChessSide;
}

interface ChessPageState {
    selectedSquare: ChessSquare;
}

class ChessPage extends React.Component<ChessPageProps, ChessPageState> {
    private possibleMoves: ChessSquare[] = [];
    private promotionMove: ChessSquare;
    private enPassantSquare: ChessSquare;

    constructor(props: ChessPageProps) {
        super(props);
        this.state = {
            selectedSquare: null,
        };

        if (Utils.isNull(this.props.chessGameId)) {
            const savedGameId = AppStorage.getStorage(StorageKey.CHESS_GAME_ID);
            if (Utils.isNotNull(savedGameId)) {
                ApiLichessUtils.getUpdatesForGame(savedGameId);
            }
        }

        if (Utils.isNotNull(this.props.chessGameId)) {
            ApiLichessUtils.getUpdatesForGame(this.props.chessGameId);
        }
    }

    componentDidUpdate(prevProps: Readonly<ChessPageProps>, prevState: Readonly<ChessPageState>, snapshot?: any) {
        if (Utils.isArrayEmpty(this.props.chessPieces) ||
            (Utils.isArrayNotEmpty(this.props.chessMoves) && prevProps.chessMoves.length !== this.props.chessMoves.length)) {
            ChessUtils.processMoves(this.props.chessMoves);
        }
        if (prevState.selectedSquare !== this.state.selectedSquare) {
            this.promotionMove = null;
            if (Utils.isNotNull(this.state.selectedSquare)) {
                this.possibleMoves = ChessUtils.calculatePossibleMoves(this.state.selectedSquare, this.props.chessPieces,
                    this.props.playerSide, false, this.props.castleInfo);
            } else {
                this.possibleMoves = [];
            }
            this.setState({});
        }
    }

    clickPromotion(promotion: ChessPieceType): void {
        const move = {
            from: this.state.selectedSquare,
            to: this.promotionMove,
            promoteTo: promotion
        };
        ApiLichessUtils.makeMove(move);
        this.promotionMove = null;
        this.setState({selectedSquare: null});
    }

    clickSquare(square: ChessSquare): void {
        if (Utils.isNotNull(this.state.selectedSquare)) {
            if (ChessUtils.chessSquaresEqual(this.state.selectedSquare, square)) {
                this.setState({selectedSquare: null});
            } else if (ChessUtils.squareOnSidePiece(square, this.props.chessPieces, this.props.playerSide)) {
                this.setState({selectedSquare: square})
            } else if (Utils.isNotNull(this.possibleMoves.find(possibleMove => ChessUtils.chessSquaresEqual(possibleMove, square)))) {
                const move = {
                    from: this.state.selectedSquare,
                    to: square
                };
                if (ChessUtils.getPieceFromSquare(this.state.selectedSquare, this.props.chessPieces).type === ChessPieceType.PAWN &&
                    (this.props.playerSide === ChessSide.WHITE && square.row === 8 ||
                    this.props.playerSide === ChessSide.BLACK && square.row === 1)) {
                    this.promotionMove = square;
                    this.setState({});
                } else {
                    ApiLichessUtils.makeMove(move);
                    this.setState({selectedSquare: null});
                }
            }
        } else if (ChessUtils.squareOnSidePiece(square, this.props.chessPieces, this.props.playerSide)) {
            this.setState({selectedSquare: square})
        }
    }

    rednderChessBoard(): JSX.Element[] {
        const chessRows: JSX.Element[] = [];
        if (Utils.isArrayNotEmpty(this.props.chessPieces)) {
            for (let row = 1; row <= 8; row++) {
                let chessRow: JSX.Element[] = [];
                for (let col = 1; col <= 8; col++) {
                    const square: ChessSquare = {row, col};
                    let isThread = false;
                    const pieceIndex = this.props.chessPieces.findIndex((piece: ChessPiece) => {
                        return ChessUtils.chessSquaresEqual(square, piece.square);
                    })
                    const isPossibleMove = this.possibleMoves.findIndex((possibleMove: ChessSquare) => {
                        return ChessUtils.chessSquaresEqual(square, possibleMove);
                    }) !== -1;
                    const lastMove = this.props.chessMoves[this.props.chessMoves.length - 1];
                    let isLastMoveFrom = false;
                    let isLastMoveTo = false;
                    if (Utils.isNotNull(lastMove)) {
                        isLastMoveFrom = ChessUtils.chessSquaresEqual(square, lastMove.from);
                        isLastMoveTo = ChessUtils.chessSquaresEqual(square, lastMove.to);
                    }
                    if (Utils.isNotNull(this.props.sideInCheck) && pieceIndex !== -1 && this.props.chessPieces[pieceIndex].type === ChessPieceType.KING &&
                        this.props.chessPieces[pieceIndex].side === this.props.sideInCheck) {
                        isThread = true
                    }
                    chessRow.push(
                        <div className={`chess-square chess-square-${(row + col) % 2 === 0 ? "black" : "white"} 
                    ${this.state.selectedSquare?.row === row && this.state.selectedSquare?.col === col ? "clicked-square" : ""}
                    ${isLastMoveFrom ? "last-move-from" : isLastMoveTo ? "last-move-to" : ""}`}
                             onMouseDown={() => {this.clickSquare({col,row})}}
                             key={`${row}-${col}`}>
                            { pieceIndex !== -1 && <div className={`chess-piece chess-piece-${this.props.chessPieces[pieceIndex].side.toLowerCase()}`}>
                                <FontAwesomeIcon className={"back-icon"} icon={ChessUtils.getPieceIcon(this.props.chessPieces[pieceIndex].type)} />
                            </div>
                            }
                            {
                                isPossibleMove && <div className={`${pieceIndex !== -1 ? "possible-move-with-piece" : "possible-move"}`}></div>
                            }
                            {
                                isThread && <div className={"king-piece-thread"}></div>
                            }
                        </div>);
                }
                chessRows.push(<div className={`chess-row`}>
                        {chessRow}
                    </div>
                );
            }
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
            {Utils.isNotNull(this.promotionMove) && <div className={`promotion-window`}>
                <div className={`chess-piece chess-piece-${this.props.playerSide.toLowerCase()}`}
                     onClick={() =>this.clickPromotion(ChessPieceType.KNIGHT)}>
                    <FontAwesomeIcon className={"back-icon"} icon={ChessUtils.getPieceIcon(ChessPieceType.KNIGHT)} />
                </div>
                <div className={`chess-piece chess-piece-${this.props.playerSide.toLowerCase()}`}
                     onClick={() =>this.clickPromotion(ChessPieceType.BISHOP)}>
                    <FontAwesomeIcon className={"back-icon"} icon={ChessUtils.getPieceIcon(ChessPieceType.BISHOP)} />
                </div>
                <div className={`chess-piece chess-piece-${this.props.playerSide.toLowerCase()}`}
                     onClick={() =>this.clickPromotion(ChessPieceType.ROOK)}>
                    <FontAwesomeIcon className={"back-icon"} icon={ChessUtils.getPieceIcon(ChessPieceType.ROOK)} />
                </div>
                <div className={`chess-piece chess-piece-${this.props.playerSide.toLowerCase()}`}
                     onClick={() =>this.clickPromotion(ChessPieceType.QUEEN)}>
                    <FontAwesomeIcon className={"back-icon"} icon={ChessUtils.getPieceIcon(ChessPieceType.QUEEN)} />
                </div>
            </div>}
            <div className={`chess-board-wrapper ${this.props.playerSide.toLowerCase()}-player-view`}>
                {(!this.props.chessGameId || this.props.gameEnded) &&
                    <ChessGameConfigurator />}

                {this.props.chessGameId && !this.props.gameEnded && <>
                    <div className={`player-window-wrapper player ${this.props.playerSide === this.props.sideInTurn ? "active" : ""}`}>
                        <div className={`avatar avatar-${this.props.playerAvatar?.toLowerCase()}`}>
                            <div className={`avatar-label`}>{`Player${this.props.playerSide === this.props.sideInTurn ? "'s turn" : " waiting"}`}</div>
                        </div>
                    </div>
                    <div className={`player-window-wrapper opponent ${this.props.opponentSide === this.props.sideInTurn ? "active" : ""}`}>
                        <div className={`avatar avatar-${this.props.opponentLevel?.toLowerCase()}`}>
                            <div className={`avatar-label`}>{`Opponent${this.props.opponentSide === this.props.sideInTurn ? "'s turn" : " waiting"}`}</div>
                        </div>
                    </div>
                    {this.rednderChessBoard()}
                    {this.rednderBoardLetters()}
                    <button className={`game-end`} onClick={() => {ApiLichessUtils.resignGame()}}>
                        <span>End game </span>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </>}
            </div>
        </div>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { gameId, opponentLevel, playerSide, chessMoves, gameEnded, playerAvatar } = state.chessReducer;
        const { chessPieces, sideInTurn, castleInfo, sideInCheck } = state.chessBoardReducer as ChessBoardModel;
        return {
            ...ownProps,
            chessGameId: gameId,
            opponentLevel,
            playerSide,
            opponentSide: playerSide === ChessSide.WHITE ? ChessSide.BLACK : ChessSide.WHITE,
            playerAvatar,
            chessMoves,
            gameEnded,
            chessPieces,
            sideInTurn,
            castleInfo,
            sideInCheck
        }
    })(ChessPage);

