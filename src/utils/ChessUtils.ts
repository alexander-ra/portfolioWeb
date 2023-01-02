import {inspect} from "util";
import Utils from "./Utils";
import store from "../reducers/store";
import {SET_CHESS_BOARD_PIECES} from "../reducers/chessBoard/ChessBoardActionTypes";
import {
    setCastleInfo,
    setChessBoardPieces, setEnPassantSquare, setSideInCheck, updateProcessedBoard
} from "../reducers/chessBoard/chessBoardAction";
import { ChessSquare } from "../models/chess/ChessSquare";
import { ChessPiece } from "../models/chess/ChessPiece";
import { ChessSide } from "../models/chess/ChessSide";
import { ChessPieceType } from "../models/chess/ChessPieceType";
import { ChessMove } from "../models/chess/ChessMove";
import { ChessCastleInfo } from "../models/chess/ChessCastleInfo";
import { ChessLetters } from "../models/chess/ChessLetters";
import { IconType } from "../models/common/IconType";

export class ChessUtils {

    public static chessSquaresEqual(a: ChessSquare, b: ChessSquare): boolean {
        if (Utils.isNull(a) || Utils.isNull(b)) {
            return false;
        } else {
            return a.col === b.col && a.row === b.row;
        }
    }

    public static getInitialBoardPieces(): ChessPiece[] {
        const boardPieces = [];
        for (let col = 1; col <= 8; col++) {
            boardPieces.push({
                side: ChessSide.WHITE,
                type: ChessPieceType.PAWN,
                square: {
                    row: 2,
                    col: col
                }
            });

            boardPieces.push({
                side: ChessSide.BLACK,
                type: ChessPieceType.PAWN,
                square: {
                    row: 7,
                    col: col
                }
            });
        }

        // White PIECES \/
        boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.ROOK,
            square: {
                row: 1,
                col: 1
            }
        });

        boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.ROOK,
            square: {
                row: 1,
                col: 8
            }

        });

        boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.KNIGHT,
            square: {
                row: 1,
                col: 2
            }

        });

        boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.KNIGHT,
            square: {
                row: 1,
                col: 7
            }

        });

        boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.BISHOP,
            square: {
                row: 1,
                col: 3
            }

        });

        boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.BISHOP,
            square: {
                row: 1,
                col: 6
            }

        });

        boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.QUEEN,
            square: {
                row: 1,
                col: 4
            }

        });

        boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.KING,
            square: {
                row: 1,
                col: 5
            }

        });

        // BLACK PIECES \/

        boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.ROOK,
            square: {
                row: 8,
                col: 1
            }

        });

        boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.ROOK,
            square: {
                row: 8,
                col: 8
            }

        });

        boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.KNIGHT,
            square: {
                row: 8,
                col: 2
            }

        });

        boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.KNIGHT,
            square: {
                row: 8,
                col: 7
            }

        });

        boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.BISHOP,
            square: {
                row: 8,
                col: 3
            }

        });

        boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.BISHOP,
            square: {
                row: 8,
                col: 6
            }

        });

        boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.QUEEN,
            square: {
                row: 8,
                col: 4
            }

        });

        boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.KING,
            square: {
                row: 8,
                col: 5
            }

        });
        return boardPieces;
    }

    public static processMoves(moves: ChessMove[]): void {
        console.log("processingmoves");
        const chessBoardReducer = store.getState().chessBoardReducer;
        let processedPieces = this.returnCopyOfBoard(chessBoardReducer.chessPieces);
        let oldSideInTurn = chessBoardReducer.sideInTurn;
        if (!Utils.isArrayNotEmpty(processedPieces)) {
            processedPieces = ChessUtils.getInitialBoardPieces();
        }
        let processedMoves = chessBoardReducer.processedMoves;
        if (Utils.isArrayNotEmpty(moves)) {
            while (processedMoves < moves.length) {
                processedPieces = this.getBoardAfterMove(processedPieces, moves[processedMoves]);
                processedMoves++;
            }
        }
        const newSideInTurn = (processedMoves - chessBoardReducer.processedMoves) % 2 === 0 ?
            oldSideInTurn : ChessUtils.getOppositeSide(oldSideInTurn);
        store.dispatch(updateProcessedBoard(processedPieces, processedMoves, newSideInTurn));
        this.doCheckDetection(newSideInTurn);
    }

    public static doCheckDetection(side: ChessSide) {
        const { chessPieces, processedMoves, sideInCheck } = store.getState().chessBoardReducer;
        let newSideInCheck = null;
        if (processedMoves > 0) {
            const playerKing = chessPieces.find(piece => piece.type === ChessPieceType.KING && piece.side === side);
            chessPieces.filter(piece => {
                return piece.side === ChessUtils.getOppositeSide(side);
            }).forEach(enemyPiece => {
                if (Utils.isNull(newSideInCheck)) {
                    ChessUtils.calculatePossibleMoves(enemyPiece.square, chessPieces, enemyPiece.side, true).forEach(move => {
                        if(ChessUtils.chessSquaresEqual(move, playerKing.square) && Utils.isNull(newSideInCheck)) {
                            newSideInCheck = side;
                            return;
                        }
                    });
                } else {
                    return;
                }
            })
        }
        if (sideInCheck !== newSideInCheck) {
            store.dispatch(setSideInCheck(newSideInCheck));
        } else {
            console.log("realistic case", sideInCheck, newSideInCheck);
        }
    }

    public static processEnPassantMove(chessBoard: ChessPiece[], side: ChessSide, move: ChessMove): ChessPiece[] {
        const { enPassantSquare } = store.getState().chessBoardReducer;
        let processedChessBoard = this.returnCopyOfBoard(chessBoard);

        if (Utils.isNotNull(enPassantSquare) && ChessUtils.chessSquaresEqual(move.to, enPassantSquare)) {
            if (enPassantSquare.row === 3) {
                const pawnToRemoveIndex = chessBoard.findIndex(piece => {
                    return piece.side === ChessUtils.getOppositeSide(side) && piece.type === ChessPieceType.PAWN && ChessUtils.chessSquaresEqual(piece.square, {row: 4, col: enPassantSquare.col});
                })
                if (pawnToRemoveIndex !== -1) {
                    processedChessBoard.splice(pawnToRemoveIndex, 1);
                }
            }

            if (enPassantSquare.row === 6) {
                const pawnToRemoveIndex = chessBoard.findIndex(piece => {
                    return piece.side === ChessUtils.getOppositeSide(side) && piece.type === ChessPieceType.PAWN && ChessUtils.chessSquaresEqual(piece.square, {row: 5, col: enPassantSquare.col});
                })
                if (pawnToRemoveIndex !== -1) {
                    processedChessBoard.splice(pawnToRemoveIndex, 1);
                }
            }
        }

        if (side === ChessSide.WHITE && move.from.row === 2 && move.to.row === 4) {
            store.dispatch(setEnPassantSquare({row: 3, col: move.to.col}));
        } else if (side === ChessSide.BLACK && move.from.row === 7 && move.to.row === 5) {
            store.dispatch(setEnPassantSquare({row: 6, col: move.to.col}));
        } else if (Utils.isNotNull(enPassantSquare)) {
            store.dispatch(setEnPassantSquare(null));
        }

        return processedChessBoard;
    }

    public static processCastleMove(chessBoard: ChessPiece[], pieceToMove: ChessPiece, move: ChessMove): ChessPiece[] {
        const { enPassantSquare, castleInfo } = store.getState().chessBoardReducer;
        const { playerSide } = store.getState().chessReducer;
        let processedChessBoard = this.returnCopyOfBoard(chessBoard);
        const processedCastleInfo = { ...castleInfo };

        if (pieceToMove.type === ChessPieceType.KING) {
            if (!castleInfo.kingMoved && pieceToMove.side === playerSide) {
            processedCastleInfo.kingMoved = true;
        }
        const colDiff = move.to.col - pieceToMove.square.col;
        if (colDiff > 1) {

            ChessUtils.getPieceFromSquare({row: pieceToMove.square.row, col: 8}, processedChessBoard).square = {
                row: pieceToMove.square.row,
                col: move.to.col - 1
            };
            if (pieceToMove.side === playerSide) {
                processedCastleInfo.castleHappened = true;
            }
        } else if (colDiff < -1) {
            ChessUtils.getPieceFromSquare({row: pieceToMove.square.row, col: 1}, processedChessBoard).square = {
                row: pieceToMove.square.row,
                col: move.to.col + 1
            };
            if (pieceToMove.side === playerSide) {
                processedCastleInfo.castleHappened = true;
            }
        }
        } else if (pieceToMove.type === ChessPieceType.ROOK && pieceToMove.side === playerSide) {
            if (!processedCastleInfo.leftRookMoved && pieceToMove.square.col === 1) {
                processedCastleInfo.leftRookMoved = true;
            }
            if (!processedCastleInfo.rightRookMoved && pieceToMove.square.col === 8) {
                processedCastleInfo.rightRookMoved = true;
            }
        }

        store.dispatch(setCastleInfo(processedCastleInfo));
        return processedChessBoard;
    }

    public static getBoardAfterMove(chessPieces:ChessPiece[], move: ChessMove): ChessPiece[] {
        const { castleInfo } = store.getState().chessBoardReducer;
        const { playerSide } = store.getState().chessReducer;
        let processedPieces = this.returnCopyOfBoard(chessPieces);
        processedPieces = this.removePieceFromBoard(processedPieces, move.to);

        const movingPieceIndex = processedPieces.findIndex((pieceToMove) => {
            return ChessUtils.chessSquaresEqual(move.from, pieceToMove.square);
        })
        if (movingPieceIndex !== -1) {
            if (processedPieces[movingPieceIndex].type === ChessPieceType.KING || processedPieces[movingPieceIndex].type === ChessPieceType.ROOK) {
                processedPieces = this.processCastleMove(processedPieces, processedPieces[movingPieceIndex], move);
            }

            if (processedPieces[movingPieceIndex].type === ChessPieceType.PAWN) {
                processedPieces = this.processEnPassantMove(processedPieces, processedPieces[movingPieceIndex].side, move);
            }

            processedPieces[movingPieceIndex].square = move.to;

            if (Utils.isNotNull(move.promoteTo)) {
                processedPieces[movingPieceIndex].type = move.promoteTo ? move.promoteTo : processedPieces[movingPieceIndex].type;
            }
        } else {
            //TODO: throw err;
        }
        return processedPieces;
    }

    private static returnCopyOfBoard(chessBoard: ChessPiece[]): ChessPiece[] {
        const clonedBoard = [];
        if (Utils.isArrayNotEmpty(chessBoard)) {
            chessBoard.forEach(val => clonedBoard.push(Object.assign({}, val)));
        }
        return clonedBoard;
    }

    public static removePieceFromBoard(boardPieces: ChessPiece[], square: ChessSquare) {
        const deadPieceIndex = boardPieces.findIndex((pieceToRemove) => {
            return ChessUtils.chessSquaresEqual(square, pieceToRemove.square);
        })
        if (deadPieceIndex !== -1) {
            boardPieces.splice(deadPieceIndex, 1);
        }
        return boardPieces;
        //TODO: handle missing piece
    }


    public static calculatePossibleMoves(square: ChessSquare, chessBoard: ChessPiece[], playerSide: ChessSide, skipCheck: boolean, castleInfo?: ChessCastleInfo): ChessSquare[] {
        let uncheckedMoves: ChessSquare[] = [];
        if (this.squareOnSidePiece(square, chessBoard, playerSide)){
            const playerPiece = this.getPieceFromSquare(square, chessBoard);
            switch (playerPiece.type) {
                case ChessPieceType.PAWN:
                    uncheckedMoves = this.getPawnPossibleMoves(square, chessBoard, playerSide);
                    break;
                case ChessPieceType.KNIGHT:
                    uncheckedMoves = this.getKnightPossibleMoves(square, chessBoard, playerSide);
                    break;
                case ChessPieceType.BISHOP:
                    uncheckedMoves = this.getBishopPossibleMoves(square, chessBoard, playerSide);
                    break;
                case ChessPieceType.ROOK:
                    uncheckedMoves = this.getRookPossibleMoves(square, chessBoard, playerSide);
                    break;
                case ChessPieceType.QUEEN:
                    uncheckedMoves = this.getQueenPossibleMoves(square, chessBoard, playerSide);
                    break;
                case ChessPieceType.KING:
                    uncheckedMoves = this.getKingPossibleMoves(square, chessBoard, playerSide, castleInfo);
                    break;
                default:
                    return [];
            }

            if (skipCheck) {
                return uncheckedMoves;
            } else {
                return this.getCheckedMoves(playerPiece, uncheckedMoves, chessBoard);
            }
        } else {
            throw new Error(`Cannot calc possible for enemy ${JSON.stringify(this.squareOnSidePiece(square, chessBoard, playerSide))}`);
        }
    }

    private static getCheckedMoves(piece: ChessPiece, possibleMoves: ChessSquare[], chessBoard: ChessPiece[]): ChessSquare[] {
        const checkedMoves: ChessSquare[] = [];

        possibleMoves.forEach(possibleMove => {
            let willBeInCheck = false;
            const potentialBoard: ChessPiece[] = JSON.parse(JSON.stringify(chessBoard));
            const movingPiece = this.getPieceFromSquare(piece.square, potentialBoard);
            //removing piece in case of capture
            const indexToRemove = potentialBoard.findIndex(pieceToBeRemoved => {
                return this.chessSquaresEqual(pieceToBeRemoved.square, possibleMove);
            })
            if (indexToRemove !== -1) {
                potentialBoard.splice(indexToRemove, 1);
            }
            movingPiece.square = possibleMove;
            const playerKing = potentialBoard.find(tempPiece => {
                return tempPiece.side === piece.side && tempPiece.type === ChessPieceType.KING;
            })
            potentialBoard.filter(potentialEnemyPiece => {
                return potentialEnemyPiece.side !==  piece.side
            }).forEach(enemyPiece => {
                if (!willBeInCheck) {
                    this.calculatePossibleMoves(enemyPiece.square, potentialBoard, enemyPiece.side, true).forEach(move => {
                        if(this.chessSquaresEqual(move, playerKing.square) && !willBeInCheck) {
                            willBeInCheck = true;
                            return;
                        }
                    });
                }
            })
            if (!willBeInCheck) {
                checkedMoves.push(possibleMove);
            }
        })

        if (piece.type === ChessPieceType.KING) {
            const validLeftMove = checkedMoves.findIndex((leftMove => {
                return leftMove.row === piece.square.row && leftMove.col === piece.square.col - 1;
            })) !== -1;
            const validLeftCastleIndex = checkedMoves.findIndex((uncheckedInvalidMove => {
                return uncheckedInvalidMove.row === piece.square.row && uncheckedInvalidMove.col === piece.square.col - 2;
            }));
            if (!validLeftMove && validLeftCastleIndex !== -1) {
                checkedMoves.splice(validLeftCastleIndex, 1);
            }

            const validRightMove = checkedMoves.findIndex((uncheckedInvalidMove => {
                return uncheckedInvalidMove.row === piece.square.row && uncheckedInvalidMove.col === piece.square.col + 1;
            })) !== -1;
            const validRightCastleIndex = checkedMoves.findIndex((uncheckedInvalidMove => {
                return uncheckedInvalidMove.row === piece.square.row && uncheckedInvalidMove.col === piece.square.col + 2;
            }));
            if (!validRightMove && validRightCastleIndex !== -1) {
                checkedMoves.splice(validRightCastleIndex, 1);
            }
        }

        return checkedMoves;
    }

    private static getPawnPossibleMoves(square: ChessSquare, chessBoard: ChessPiece[], playerSide: ChessSide): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = [];
        const step = playerSide === ChessSide.WHITE ? 1 : -1;
        const doubleStepRow = playerSide === ChessSide.WHITE ? 2 : 7;
        const attackingSquares: ChessSquare[] = [
            {
                row: square.row + step,
                col: square.col + 1
            },
            {
                row: square.row + step,
                col: square.col - 1
            }
        ];
        const forwardMove = {
            row: square.row + step,
            col: square.col
        };
        if (Utils.isNull(this.getPieceFromSquare(forwardMove, chessBoard))) {
            uncheckedMoves.push(forwardMove);

            const doubleForwardMove = {
                row: square.row + (step * 2),
                col: square.col
            };
            if (square.row == doubleStepRow && Utils.isNull(this.getPieceFromSquare(doubleForwardMove, chessBoard))) {
                uncheckedMoves.push({
                    row: square.row + (step * 2),
                    col: square.col
                })
            }
        }
        attackingSquares.forEach(attackSquare => {
            if (this.squareOnSidePiece(attackSquare, chessBoard, this.getOppositeSide(playerSide) )) {
                uncheckedMoves.push(attackSquare);
            }
        })
        return uncheckedMoves;
    }

    private static getKnightPossibleMoves(square: ChessSquare, chessBoard: ChessPiece[], playerSide: ChessSide): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = [];
        const colMoves = [square.col -2,square.col -1,square.col + 1,square.col + 2];
        const rowMoves = [square.row -2,square.row -1,square.row + 1,square.row + 2];
        colMoves.filter((unfilteredCol) => unfilteredCol >= 1 && unfilteredCol <= 8).forEach(colMove => {
            rowMoves.filter((unfilteredRow) => unfilteredRow >= 1 && unfilteredRow <= 8).forEach(rowMove => {
                if (Math.abs(colMove - square.col) !== Math.abs(rowMove - square.row)) {
                    const potentialMove = {
                        col: colMove, row: rowMove
                    };
                    if (!this.squareOnSidePiece(potentialMove, chessBoard, playerSide)) {
                        uncheckedMoves.push(potentialMove);
                    }
                } else {
                    return;
                }
            });
        });
        return uncheckedMoves;
    }

    private static getBishopPossibleMoves(square: ChessSquare, chessBoard: ChessPiece[], playerSide: ChessSide): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = [];
        const colSteps = [-1, 1];
        const rowSteps = [-1, 1];
        colSteps.forEach((colStep) => {
            rowSteps.forEach((rowStep) => {
                const potentialSquare: ChessSquare = { row: square.row + rowStep, col: square.col + colStep};
                while (this.isLegalSquare(potentialSquare) && Utils.isNull(this.getPieceFromSquare(potentialSquare, chessBoard))
                    ) {
                    uncheckedMoves.push({
                        row: potentialSquare.row,
                        col: potentialSquare.col
                    });
                    potentialSquare.col += colStep;
                    potentialSquare.row += rowStep;
                }
                if (this.squareOnSidePiece(potentialSquare, chessBoard, this.getOppositeSide(playerSide))) {
                    uncheckedMoves.push({
                        row: potentialSquare.row,
                        col: potentialSquare.col
                    })
                }
            })
        })
        return uncheckedMoves;
    }

    private static getRookPossibleMoves(square: ChessSquare, chessBoard: ChessPiece[], playerSide: ChessSide): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = [];
        const colSteps = [-1, 1];
        const rowSteps = [-1, 1];
        colSteps.forEach((colStep) => {
            const potentialSquare: ChessSquare = { row: square.row, col: square.col + colStep};
            while (this.isLegalSquare(potentialSquare) && Utils.isNull(this.getPieceFromSquare(potentialSquare, chessBoard))
                ) {
                uncheckedMoves.push({
                    row: potentialSquare.row,
                    col: potentialSquare.col
                });
                potentialSquare.col += colStep;
            }
            if (this.squareOnSidePiece(potentialSquare, chessBoard, this.getOppositeSide(playerSide))) {
                uncheckedMoves.push({
                    row: potentialSquare.row,
                    col: potentialSquare.col
                })
            }
        })
        rowSteps.forEach((rowStep) => {
            const potentialSquare: ChessSquare = { row: square.row + rowStep, col: square.col};
            while (this.isLegalSquare(potentialSquare) && Utils.isNull(this.getPieceFromSquare(potentialSquare, chessBoard))
                ) {
                uncheckedMoves.push({
                    row: potentialSquare.row,
                    col: potentialSquare.col
                });
                potentialSquare.row += rowStep;
            }
            if (this.squareOnSidePiece(potentialSquare, chessBoard, this.getOppositeSide(playerSide))) {
                uncheckedMoves.push({
                    row: potentialSquare.row,
                    col: potentialSquare.col
                })
            }
        })
        return uncheckedMoves;
    }

    private static getQueenPossibleMoves(square: ChessSquare, chessBoard: ChessPiece[], playerSide: ChessSide): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = this.getRookPossibleMoves(square, chessBoard, playerSide);
        return uncheckedMoves.concat(this.getBishopPossibleMoves(square, chessBoard, playerSide));
    }

    private static getKingPossibleMoves(square: ChessSquare, chessBoard: ChessPiece[], playerSide: ChessSide, castleInfo?: ChessCastleInfo): ChessSquare[] {
        const uncheckedMoves: ChessSquare[] = [];
        const colSteps = [-1, 0, 1];
        const rowSteps = [-1, 0, 1];
        colSteps.forEach((colStep) => {
            rowSteps.forEach((rowStep) => {
                const potentialSquare: ChessSquare = { row: square.row + rowStep, col: square.col + colStep};
                if (this.isLegalSquare(potentialSquare) && !this.squareOnSidePiece(potentialSquare, chessBoard, playerSide)) {
                    uncheckedMoves.push({
                        row: potentialSquare.row,
                        col: potentialSquare.col
                    })
                }
            })
        })
        if (Utils.isNotNull(castleInfo) && !castleInfo.castleHappened && !castleInfo.kingMoved) {
            if (!castleInfo.leftRookMoved) {
                const leftCastle: ChessSquare = {
                    row: square.row,
                    col: square.col - 2
                }
                if (this.isLegalSquare(leftCastle) && !this.squareOnSidePiece(leftCastle, chessBoard, playerSide) &&
                    Utils.isNull(this.getPieceFromSquare({col: square.col - 1, row: square.row}, chessBoard)) &&
                    Utils.isNull(this.getPieceFromSquare({col: square.col - 2, row: square.row}, chessBoard)) &&
                    Utils.isNull(this.getPieceFromSquare({col: square.col - 3, row: square.row}, chessBoard))) {
                    uncheckedMoves.push({
                        row: leftCastle.row,
                        col: leftCastle.col
                    })
                }
            }
            if (!castleInfo.rightRookMoved) {
                const rightCastle: ChessSquare = {
                    row: square.row,
                    col: square.col + 2
                }
                if (this.isLegalSquare(rightCastle) && !this.squareOnSidePiece(rightCastle, chessBoard, playerSide) &&
                    Utils.isNull(this.getPieceFromSquare({col: square.col + 1, row: square.row}, chessBoard)) &&
                    Utils.isNull(this.getPieceFromSquare({col: square.col + 2, row: square.row}, chessBoard))) {
                    uncheckedMoves.push({
                        row: rightCastle.row,
                        col: rightCastle.col
                    })
                }
            }
        }
        return uncheckedMoves;
    }

    private static isLegalSquare(square: ChessSquare): boolean {
        return square.row >= 1 && square.row <= 8 && square.col >= 1 && square.col <= 8;
    }


    public static getPieceFromSquare(square: ChessSquare, chessBoard: ChessPiece[]): ChessPiece {
        const playerPiece = chessBoard.find(piece => {
            return ChessUtils.chessSquaresEqual(piece.square, square);
        });
        return playerPiece;
    }

    public static squareOnSidePiece(square: ChessSquare, chessBoard: ChessPiece[], side: ChessSide): boolean {
        const piece = this.getPieceFromSquare(square, chessBoard);
        return Utils.isNotNull(piece) && piece.side === side;
    }

    public static getOppositeSide(side: ChessSide): ChessSide {
        return side === ChessSide.WHITE ? ChessSide.BLACK : ChessSide.WHITE;
    }

    public static chessLetterToString(letter: ChessLetters): string {
        switch (letter) {
            case ChessLetters.A: return "a"
            case ChessLetters.B: return "b"
            case ChessLetters.C: return "c"
            case ChessLetters.D: return "d"
            case ChessLetters.E: return "e"
            case ChessLetters.F: return "f"
            case ChessLetters.G: return "g"
            case ChessLetters.H: return "h"
        }
        throw new Error(`Cannot find chess letter: ${letter}`);
    }

    public static charToChessLetter(char: string): ChessLetters {
        switch (char) {
            case "a": return ChessLetters.A
            case "b": return ChessLetters.B
            case "c": return ChessLetters.C
            case "d": return ChessLetters.D
            case "e": return ChessLetters.E
            case "f": return ChessLetters.F
            case "g": return ChessLetters.G
            case "h": return ChessLetters.H
        }
        throw new Error(`String does not represent a chess letter: ${char}`);
    }

    public static getPieceIcon(pieceType: ChessPieceType): any {

        switch (pieceType) {
            case ChessPieceType.PAWN:
                return IconType.faChessPawn
            case ChessPieceType.BISHOP:
                return IconType.faChessBishop
            case ChessPieceType.KNIGHT:
                return IconType.faChessKnight
            case ChessPieceType.ROOK:
                return IconType.faChessRook
            case ChessPieceType.QUEEN:
                return IconType.faChessQueen
            case ChessPieceType.KING:
                return IconType.faChessKing
        }
        return null;
    }
}