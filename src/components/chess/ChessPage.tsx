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
    private enPassantSquare: ChessSquare;
    private isInCheck?: ChessSide;
    private sideInTurn: ChessSide;
    private sideWaiting: ChessSide;
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
        this.processedMoves = 0;
        this.boardPieces = ChessUtils.getInitialBoardPieces();
        this.castleInfo = {
            castleHappened: false, leftRookMoved: false, rightRookMoved: false, kingMoved: false
        };
        this.sideInTurn = null;
        this.sideWaiting = null;
        this.isInCheck = null;


        ApiLichessUtils.getNewGame(ChessAiDifficulty.EASY, ChessSide.WHITE);
    }

    changeBoard(moves: ChessMove[]): void {
        if (Utils.isArrayNotEmpty(moves)) {
            while (this.processedMoves < moves.length) {
                this.processMove(moves[this.processedMoves]);
            }
        }
        this.isInCheck = null;
        if (this.processedMoves > 0) {
            const playerKing = this.boardPieces.find(piece => piece.type === ChessPieceType.KING && piece.side === this.sideInTurn);
            this.boardPieces.filter(piece => {
                return piece.side === this.sideWaiting;
            }).forEach(enemyPiece => {
                if (Utils.isNull(this.isInCheck)) {
                    ChessUtils.calculatePossibleMoves(enemyPiece.square, this.boardPieces, enemyPiece.side, true).forEach(move => {
                        if(ChessUtils.chessSquaresEqual(move, playerKing.square) && !this.isInCheck) {
                            this.isInCheck = this.sideInTurn;
                            return;
                        }
                    });
                }
            })
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
                if (!this.castleInfo.rightRookMoved && pieceToMove.square.col === 8) {
                    this.castleInfo.rightRookMoved = true;
                }
            } else if (pieceToMove.type === ChessPieceType.PAWN) {
                if (Utils.isNotNull(this.enPassantSquare) && ChessUtils.chessSquaresEqual(move.to, this.enPassantSquare)) {
                    if (this.enPassantSquare.row === 3) {
                        const pawnToRemoveIndex = this.boardPieces.findIndex(piece => {
                            return piece.type === ChessPieceType.PAWN && ChessUtils.chessSquaresEqual(piece.square, {row: 4, col: this.enPassantSquare.col});
                        })
                        if (pawnToRemoveIndex !== -1) {
                            this.boardPieces.splice(pawnToRemoveIndex, 1);
                        }
                    }

                    if (this.enPassantSquare.row === 6) {
                        const pawnToRemoveIndex = this.boardPieces.findIndex(piece => {
                            return piece.type === ChessPieceType.PAWN && ChessUtils.chessSquaresEqual(piece.square, {row: 5, col: this.enPassantSquare.col});
                        })
                        if (pawnToRemoveIndex !== -1) {
                            this.boardPieces.splice(pawnToRemoveIndex, 1);
                        }
                    }
                }


                if (pieceToMove.side === ChessSide.WHITE && move.from.row === 2 && move.to.row === 4) {
                    this.enPassantSquare = {row: 3, col: move.to.col};
                } else if (pieceToMove.side === ChessSide.BLACK && move.from.row === 7 && move.to.row === 5) {
                    this.enPassantSquare = {row: 6, col: move.to.col};
                } else {
                    this.enPassantSquare = null;
                }
            }

            pieceToMove.square = move.to;
            this.sideWaiting = pieceToMove.side;
            this.sideInTurn = ChessUtils.getOppositeSide(pieceToMove.side)

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
                const square: ChessSquare = {row, col};
                let isThread = false;
                const pieceIndex = this.boardPieces.findIndex((piece: ChessPiece) => {
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
                if (Utils.isNotNull(this.isInCheck) && pieceIndex !== -1 && this.boardPieces[pieceIndex].type === ChessPieceType.KING &&
                    this.boardPieces[pieceIndex].side === this.isInCheck) {
                    isThread = true
                }
                chessRow.push(
                <div className={`chess-square chess-square-${(row + col) % 2 === 0 ? "black" : "white"} 
                    ${this.state.selectedSquare?.row === row && this.state.selectedSquare?.col === col ? "clicked-square" : ""}
                    ${isLastMoveFrom ? "last-move-from" : isLastMoveTo ? "last-move-to" : ""}`}
                    onMouseDown={() => {this.clickSquare({col,row})}}>
                    { pieceIndex !== -1 && <div className={`chess-piece chess-piece-${this.boardPieces[pieceIndex].side.toLowerCase()}`}>
                        <FontAwesomeIcon className={"back-icon"} icon={ChessUtils.getPieceIcon(this.boardPieces[pieceIndex].type)} />
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

