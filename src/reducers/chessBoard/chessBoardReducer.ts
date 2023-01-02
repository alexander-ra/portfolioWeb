import { ChessCastleInfo } from "../../models/chess/ChessCastleInfo";
import { ChessPiece } from "../../models/chess/ChessPiece";
import { ChessSide } from "../../models/chess/ChessSide";
import { ChessSquare } from "../../models/chess/ChessSquare";
import {
    SET_EN_PASSANT_SQUARE,
    RESET_BOARD_STATE,
    SET_CHESS_BOARD_PIECES,
    SET_SIDE_IN_CHECK, SET_CASTLE_INFO, UPDATE_PROCESSED_BOARD,
} from "./ChessBoardActionTypes";


export interface ChessBoardModel {
    chessPieces: ChessPiece[];
    processedMoves: number;
    castleInfo: ChessCastleInfo;
    sideInTurn: ChessSide;
    sideInCheck: ChessSide;
    enPassantSquare: ChessSquare;
}

const initialState: ChessBoardModel = {
    chessPieces: [],
    processedMoves: 0,
    castleInfo: {
        castleHappened: false, leftRookMoved: false, rightRookMoved: false, kingMoved: false
    },
    sideInTurn: ChessSide.WHITE,
    sideInCheck: null,
    enPassantSquare: null
};

export default function chessBoardReducer(state = initialState, action: any): ChessBoardModel {
    switch (action.type) {
        case SET_CHESS_BOARD_PIECES: {
            return {
                ...state,
                chessPieces: action.payload.chessPieces
            }
        }
        case RESET_BOARD_STATE: {
            return {
                ...initialState,
            }
        }
        case SET_SIDE_IN_CHECK: {
            return {
                ...state,
                sideInCheck: action.payload.side,
            }
        }
        case SET_EN_PASSANT_SQUARE: {
            return {
                ...state,
                enPassantSquare: action.payload.square,
            }
        }
        case SET_CASTLE_INFO: {
            return {
                ...state,
                castleInfo: action.payload.castleInfo,
            }
        }
        case UPDATE_PROCESSED_BOARD: {
            return {
                ...state,
                chessPieces: action.payload.processedBoard,
                processedMoves: action.payload.processedMoves,
                sideInTurn: action.payload.sideInTurn
            }
        }
        default:
            return state
    }
}