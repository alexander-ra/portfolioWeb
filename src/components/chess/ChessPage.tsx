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
    ChessPieceType,
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
    opponentSide: ChessSide;
    chessMoves: ChessMove[];
    gameEnded: boolean;
}

interface LandingCubeState {
    selectedSquare: ChessSquare;
}

class ChessPage extends React.Component<LandingCubeProps, LandingCubeState> {
    private boardPieces: ChessPiece[] = [];
    private possibleMoves: ChessSquare[] = [];
    private processedMoves: number = 0;
    private promotionMove: ChessSquare;
    private castleInfo = {
        castleHappened: false,
        leftRookMoved: false,
        rightRookMoved: false,
        kingMoved: false
    };

    constructor(props: LandingCubeProps) {
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
        if (prevState.selectedSquare !== this.state.selectedSquare) {
            this.promotionMove = null;
            if (Utils.isNotNull(this.state.selectedSquare)) {
                this.possibleMoves = ChessUtils.calculatePossibleMoves(this.state.selectedSquare, this.boardPieces, this.props.playerSide, false, this.castleInfo);
            } else {
                this.possibleMoves = [];
            }
            this.setState({});
        }
    }

    crateNewGame(): void {
        if (this.props.gameEnded) {
            this.processedMoves = 0;
            this.boardPieces = ChessUtils.getInitialBoardPieces();
        }
        this.castleInfo = {
            castleHappened: false, leftRookMoved: false, rightRookMoved: false, kingMoved: false
        };

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

        // Process dead piece
        const deadPieceIndex = this.boardPieces.findIndex((pieceToRemove) => {
            return ChessUtils.chessSquaresEqual(move.to, pieceToRemove.square);
        })
        if (deadPieceIndex !== -1) {
            this.boardPieces.splice(deadPieceIndex, 1);
        }

        // Move chosen piece
        const movingPieceIndex = this.boardPieces.findIndex((pieceToMove) => {
            return ChessUtils.chessSquaresEqual(move.from, pieceToMove.square);
        })
        if (movingPieceIndex !== -1) {
            const pieceToMove = this.boardPieces[movingPieceIndex];
            if (pieceToMove.type === ChessPieceType.KING) {
                if (!this.castleInfo.kingMoved && pieceToMove.side === this.props.playerSide) {
                    this.castleInfo.kingMoved = true;
                }
                const colDiff = move.to.col - pieceToMove.square.col;
                if (colDiff > 1) {
                    console.log("performing castle for", pieceToMove);
                    ChessUtils.getPieceFromSquare({row: pieceToMove.square.row, col: 8}, this.boardPieces).square = {
                        row: pieceToMove.square.row,
                        col: move.to.col - 1
                    };
                    if (pieceToMove.side === this.props.playerSide) {
                        this.castleInfo.castleHappened = true;
                    }
                } else if (colDiff < -1) {
                    console.log("performing castle for", pieceToMove);
                    ChessUtils.getPieceFromSquare({row: pieceToMove.square.row, col: 1}, this.boardPieces).square = {
                        row: pieceToMove.square.row,
                        col: move.to.col + 1
                    };
                    if (pieceToMove.side === this.props.playerSide) {
                        this.castleInfo.castleHappened = true;
                    }
                }
            } else if (pieceToMove.type === ChessPieceType.ROOK && pieceToMove.side === this.props.playerSide) {
                if (!this.castleInfo.leftRookMoved && pieceToMove.square.col === 1) {
                    this.castleInfo.leftRookMoved = true;
                }
                if (!this.castleInfo.leftRookMoved && pieceToMove.square.col === 1) {
                    this.castleInfo.rightRookMoved = true;
                }
            }

            pieceToMove.square = move.to;

            if (Utils.isNotNull(move.promoteTo)) {
                pieceToMove.type = move.promoteTo ? move.promoteTo : pieceToMove.type;
            }

            this.processedMoves++;
        } else {
            //TODO: throw err;
        }

        this.setState({} );
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
            } else if (ChessUtils.squareOnSidePiece(square, this.boardPieces, this.props.playerSide)) {
                this.setState({selectedSquare: square})
            } else if (Utils.isNotNull(this.possibleMoves.find(possibleMove => ChessUtils.chessSquaresEqual(possibleMove, square)))) {
                const move = {
                    from: this.state.selectedSquare,
                    to: square
                };
                if (ChessUtils.getPieceFromSquare(this.state.selectedSquare, this.boardPieces).type === ChessPieceType.PAWN &&
                    (this.props.playerSide === ChessSide.WHITE && square.row === 8 ||
                    this.props.playerSide === ChessSide.BLACK && square.row === 1)) {
                    this.promotionMove = square;
                    this.setState({});
                } else {
                    ApiLichessUtils.makeMove(move);
                    this.setState({selectedSquare: null});
                }
            }
        } else if (ChessUtils.squareOnSidePiece(square, this.boardPieces, this.props.playerSide)) {
            this.setState({selectedSquare: square})
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
                const isPossibleMove = this.possibleMoves.findIndex((square: ChessSquare) => {
                    return square.col === col && square.row === row;
                }) !== -1;
                chessRow.push(<div className={`chess-square chess-square-${(row + col) % 2 === 0 ? "black" : "white"} 
                ${this.state.selectedSquare?.row === row && this.state.selectedSquare?.col === col ? "clicked-square" : ""}`}
                                   onMouseDown={() => {this.clickSquare({col,row})}}>
                    { pieceIndex !== -1 && <div className={`chess-piece chess-piece-${this.boardPieces[pieceIndex].side.toLowerCase()}`}>
                        <FontAwesomeIcon className={"back-icon"} icon={ChessUtils.getPieceIcon(this.boardPieces[pieceIndex].type)} />
                    </div>
                    }
                    {
                        isPossibleMove && <div className={`${pieceIndex !== -1 ? "possible-move-with-piece" : "possible-move"}`}></div>
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
                {(!this.props.chessGameId || this.props.gameEnded) && <button onClick={this.crateNewGame.bind(this)}>
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
        const { gameId, opponentLevel, playerSide, chessMoves, gameEnded } = state.chessReducer;
        return {
            ...ownProps,
            chessGameId: gameId,
            opponentLevel,
            playerSide,
            opponentSide: playerSide === ChessSide.WHITE ? ChessSide.BLACK : ChessSide.WHITE,
            chessMoves,
            gameEnded
        }
    })(ChessPage);

