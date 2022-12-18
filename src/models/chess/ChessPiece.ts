import { ChessPieceType } from "./ChessPieceType";
import { ChessSide } from "./ChessSide";
import { ChessSquare } from "./ChessSquare";

export interface ChessPiece {
    side: ChessSide,
    type: ChessPieceType,
    square: ChessSquare;
}