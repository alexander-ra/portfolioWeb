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
            if (Utils.isNotNull(this.state.selectedSquare)) {
                this.calculatePossibleMoves(this.state.selectedSquare)
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
            this.boardPieces[deadPieceIndex].square.row = 200; //TODO delete dead piece
        }

        // Move chosen piece
        const movingPieceIndex = this.boardPieces.findIndex((pieceToMove) => {
            return ChessUtils.chessSquaresEqual(move.from, pieceToMove.square);
        })
        if (movingPieceIndex !== -1) {
            this.boardPieces[movingPieceIndex].square = move.to;

            if (Utils.isNotNull(move.promoteTo)) {
                this.boardPieces[movingPieceIndex].type = move.promoteTo ? move.promoteTo : this.boardPieces[movingPieceIndex].type;
            }

            this.processedMoves++;
        } else {
            //TODO: throw err;
        }

        this.setState({} );
    }

    clickSquare(square: ChessSquare): void {
        if (Utils.isNotNull(this.state.selectedSquare)) {
            if (ChessUtils.chessSquaresEqual(this.state.selectedSquare, square)) {
                this.setState({selectedSquare: null});
            } else if (this.squareOnSidePiece(square, this.props.playerSide)) {
                this.setState({selectedSquare: square})
            } else {
                this.setState({selectedSquare: null});
                const move = {
                    from: this.state.selectedSquare ? this.state.selectedSquare : {row: 1, col: ChessLetters.A}, //TODO fix this ugly
                    to: square
                };

                ApiLichessUtils.makeMove(move);
            }
        } else if (this.squareOnSidePiece(square, this.props.playerSide)) {
            this.setState({selectedSquare: square})
        }
    }

    calculatePossibleMoves(square: ChessSquare): void {
        this.possibleMoves = [];
        if (this.squareOnSidePiece(square, this.props.playerSide)){
            const playerPiece = this.getPieceFromSquare(square);
            switch (playerPiece.type) {
                case ChessPieceType.PAWN:
                    this.possibleMoves = this.getPawnPossibleMoves(square);
                    break;
                case ChessPieceType.KNIGHT:
                    this.possibleMoves = this.getKnightPossibleMoves(square);
                    break;
                case ChessPieceType.BISHOP:
                    this.possibleMoves = this.getBishopPossibleMoves(square);
                    break;
                case ChessPieceType.ROOK:
                    this.possibleMoves = this.getRookPossibleMoves(square);
                    break;
                case ChessPieceType.QUEEN:
                    this.possibleMoves = this.getQueenPossibleMoves(square);
                    break;
                case ChessPieceType.KING:
                    this.possibleMoves = this.getKingPossibleMoves(square);
                    break;
                default:
                    return;
            }
        } else {
            throw new Error("Cannot calc possible for enemy");
        }
    }

    getPawnPossibleMoves(square: ChessSquare): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = [];
        const forwardMove = this.props.playerSide === ChessSide.WHITE ? 1 : -1;
        const attackingSquares: ChessSquare[] = [
            {
                row: square.row + forwardMove,
                col: square.col + 1
            },
            {
                row: square.row + forwardMove,
                col: square.col - 1
            }
        ];
        uncheckedMoves.push({
            row: square.row + forwardMove,
            col: square.col
        })
        if (square.row == 2) {
            uncheckedMoves.push({
                row: square.row + (forwardMove * 2),
                col: square.col
            })
        }
        attackingSquares.forEach(attackSquare => {
            if (this.squareOnSidePiece(attackSquare, this.props.opponentSide)) {
                uncheckedMoves.push(attackSquare);
            }
        })
        return uncheckedMoves;
    }

    getKnightPossibleMoves(square: ChessSquare): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = [];
        const colMoves = [square.col -2,square.col -1,square.col + 1,square.col + 2];
        const rowMoves = [square.row -2,square.row -1,square.row + 1,square.row + 2];
        colMoves.filter((unfilteredCol) => unfilteredCol >= 1 && unfilteredCol <= 8).forEach(colMove => {
            rowMoves.filter((unfilteredRow) => unfilteredRow >= 1 && unfilteredRow <= 8).forEach(rowMove => {
                if (Math.abs(colMove - square.col) !== Math.abs(rowMove - square.row)) {
                    uncheckedMoves.push({
                        col: colMove, row: rowMove
                    });
                } else {
                    return;
                }
            });
        });
        return uncheckedMoves;
    }

    getBishopPossibleMoves(square: ChessSquare): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = [];
        const colSteps = [-1, 1];
        const rowSteps = [-1, 1];
        colSteps.forEach((colStep) => {
            rowSteps.forEach((rowStep) => {
                const potentialSquare: ChessSquare = { row: square.row + rowStep, col: square.col + colStep};
                while (this.isLegalSquare(potentialSquare) && Utils.isNull(this.getPieceFromSquare(potentialSquare))
                    ) {
                    uncheckedMoves.push({
                        row: potentialSquare.row,
                        col: potentialSquare.col
                    });
                    potentialSquare.col += colStep;
                    potentialSquare.row += rowStep;
                }
                if (this.squareOnSidePiece(potentialSquare, this.props.opponentSide)) {
                    uncheckedMoves.push({
                        row: potentialSquare.row,
                        col: potentialSquare.col
                    })
                }
            })
        })
        return uncheckedMoves;
    }

    getRookPossibleMoves(square: ChessSquare): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = [];
        const colSteps = [-1, 1];
        const rowSteps = [-1, 1];
        colSteps.forEach((colStep) => {
            const potentialSquare: ChessSquare = { row: square.row, col: square.col + colStep};
            while (this.isLegalSquare(potentialSquare) && Utils.isNull(this.getPieceFromSquare(potentialSquare))
                ) {
                uncheckedMoves.push({
                    row: potentialSquare.row,
                    col: potentialSquare.col
                });
                potentialSquare.col += colStep;
            }
            if (this.squareOnSidePiece(potentialSquare, this.props.opponentSide)) {
                uncheckedMoves.push({
                    row: potentialSquare.row,
                    col: potentialSquare.col
                })
            }
        })
        rowSteps.forEach((rowStep) => {
            const potentialSquare: ChessSquare = { row: square.row + rowStep, col: square.col};
            while (this.isLegalSquare(potentialSquare) && Utils.isNull(this.getPieceFromSquare(potentialSquare))
                ) {
                uncheckedMoves.push({
                    row: potentialSquare.row,
                    col: potentialSquare.col
                });
                potentialSquare.row += rowStep;
            }
        })
        return uncheckedMoves;
    }

    getQueenPossibleMoves(square: ChessSquare): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = this.getRookPossibleMoves(square);
        return uncheckedMoves.concat(this.getBishopPossibleMoves(square));
    }

    getKingPossibleMoves(square: ChessSquare): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = [];
        const colSteps = [-1, 0, 1];
        const rowSteps = [-1, 0, 1];
        colSteps.forEach((colStep) => {
            rowSteps.forEach((rowStep) => {
                const potentialSquare: ChessSquare = { row: square.row + rowStep, col: square.col + colStep};
                if (this.isLegalSquare(potentialSquare) && !this.squareOnSidePiece(potentialSquare, this.props.playerSide)) {
                    uncheckedMoves.push({
                        row: potentialSquare.row,
                        col: potentialSquare.col
                    })
                }
            })
        })
        return uncheckedMoves;
    }

    isLegalSquare(square: ChessSquare): boolean {
        return square.row >= 1 && square.row <= 8 && square.col >= 1 && square.col <= 8;
    }


    getPieceFromSquare(square: ChessSquare): ChessPiece {
        const playerPiece = this.boardPieces.find(piece => {
            return ChessUtils.chessSquaresEqual(piece.square, square);
        });
        return playerPiece;
    }

    squareOnSidePiece(square: ChessSquare, side: ChessSide): boolean {
        const piece = this.getPieceFromSquare(square);
        return Utils.isNotNull(piece) && piece.side === side;
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
                console.log(this.possibleMoves);
                chessRow.push(<div className={`chess-square chess-square-${(row + col) % 2 === 0 ? "black" : "white"} 
                ${this.state.selectedSquare?.row === row && this.state.selectedSquare?.col === col ? "clicked-square" : ""}`}
                                   onMouseDown={() => {this.clickSquare({col,row})}}>
                    { pieceIndex !== -1 && <div className={`chess-piece chess-piece-${this.boardPieces[pieceIndex].side.toLowerCase()}`}>
                        <FontAwesomeIcon className={"back-icon"} icon={ChessUtils.getPieceIcon(this.boardPieces[pieceIndex].type)} />
                    </div>
                    }
                    {
                        isPossibleMove && <div className={"possible-move"}></div>
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

