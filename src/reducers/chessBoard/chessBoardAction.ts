import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {CubeReduceModel} from "../cube/cubeReducer";
import {
    RESET_BOARD_STATE,
    SET_CASTLE_INFO,
    SET_CHESS_BOARD_PIECES,
    SET_EN_PASSANT_SQUARE, SET_SIDE_IN_CHECK, UPDATE_PROCESSED_BOARD
} from "../chessBoard/ChessBoardActionTypes";
import { ChessPiece } from "../../models/chess/ChessPiece";
import { ChessSide } from "../../models/chess/ChessSide";
import { ChessSquare } from "../../models/chess/ChessSquare";
import { ChessCastleInfo } from "../../models/chess/ChessCastleInfo";

const setChessBoardPieces = (boardPieces: ChessPiece[]) => ({
    type: SET_CHESS_BOARD_PIECES,
    payload: {
        boardPieces
    }
});

const resetBoardState = () => ({
    type: RESET_BOARD_STATE,
    payload: {}
});

const setSideInCheck = (side: ChessSide) => ({
    type: SET_SIDE_IN_CHECK,
    payload: {
        side
    }
});

const setEnPassantSquare = (square: ChessSquare) => ({
    type: SET_EN_PASSANT_SQUARE,
    payload: {
        square
    }
});

const setCastleInfo = (castleInfo: ChessCastleInfo) => ({
    type: SET_CASTLE_INFO,
    payload: {
        castleInfo
    }
});

const updateProcessedBoard = (processedBoard: ChessPiece[], processedMoves: number, sideInTurn: ChessSide) => ({
    type: UPDATE_PROCESSED_BOARD,
    payload: {
        processedBoard,
        processedMoves,
        sideInTurn
    }
});

export { setChessBoardPieces, resetBoardState, setSideInCheck, setEnPassantSquare, setCastleInfo, updateProcessedBoard };