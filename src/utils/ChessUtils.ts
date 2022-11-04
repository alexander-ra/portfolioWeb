import {Position} from "../models/common/Position";
import {ContentPageState} from "../components/contentPage/ContentPage";
import {CircleMenuStates} from "../models/landing/CircleMenuStates";
import {
    faChessBishop, faChessKing,
    faChessKnight,
    faChessPawn, faChessQueen,
    faChessRook, faDotCircle,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import {inspect} from "util";
import Utils from "./Utils";

export enum ChessAiDifficulty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD"
}

export enum ChessLetters {
    A = 1,B = 2, C = 3, D = 4, E = 5, F = 6, G = 7, H = 8
}

export enum ChessSide {
    WHITE = "WHITE",
    BLACK = "BLACK",
}

export enum ChessStartingSide {
    WHITE = "WHITE",
    RANDOM = "RANDOM",
    BLACK = "BLACK",
}

export enum ChessPieceType {
    PAWN = "PAWN",
    KNIGHT = "KNIGHT",
    BISHOP = "BISHOP",
    ROOK = "ROOK",
    QUEEN = "QUEEN",
    KING = "KING"
}

export interface ChessSquare {
    row: number;
    col: ChessLetters;
}

export interface ChessMove {
    from: ChessSquare;
    to: ChessSquare;
    promoteTo?: ChessPieceType;
}

export interface ChessPiece {
    side: ChessSide,
    type: ChessPieceType,
    square: ChessSquare;
}

export interface CastleInfo {
    castleHappened: boolean;
    leftRookMoved: boolean;
    rightRookMoved: boolean;
    kingMoved: boolean;
};

export class ChessUtils {

    public static chessSquaresEqual(a: ChessSquare, b: ChessSquare): boolean {
        return a.col === b.col && a.row === b.row;
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


    public static calculatePossibleMoves(square: ChessSquare, chessBoard: ChessPiece[], playerSide: ChessSide, skipCheck: boolean, castleInfo?: CastleInfo): ChessSquare[] {
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

    private static getKingPossibleMoves(square: ChessSquare, chessBoard: ChessPiece[], playerSide: ChessSide, castleInfo?: CastleInfo): ChessSquare[] {
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

    public static getPieceIcon(pieceType: ChessPieceType): IconDefinition {

        switch (pieceType) {
            case ChessPieceType.PAWN:
                return faChessPawn
            case ChessPieceType.BISHOP:
                return faChessBishop
            case ChessPieceType.KNIGHT:
                return faChessKnight
            case ChessPieceType.ROOK:
                return faChessRook
            case ChessPieceType.QUEEN:
                return faChessQueen
            case ChessPieceType.KING:
                return faChessKing
        }
        return faDotCircle;
    }
}