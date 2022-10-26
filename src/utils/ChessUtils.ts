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