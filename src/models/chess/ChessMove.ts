import { ChessPieceType } from "./ChessPieceType";
import { ChessSquare } from "./ChessSquare";

export interface ChessMove {
    from: ChessSquare;
    to: ChessSquare;
    promoteTo?: ChessPieceType;
}