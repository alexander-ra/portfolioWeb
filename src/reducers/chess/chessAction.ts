import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {MAKE_MOVE, SYNC_MOVES, SET_CHESS_GAME, END_GAME} from "./ChessActionTypes";
import {CubeReduceModel} from "../cube/cubeReducer";
import {ChessReduceModel} from "./chessReducer";
import {ChessMove} from "../../utils/ChessUtils";

const setChessGame = (chessGame: ChessReduceModel) => ({
    type: SET_CHESS_GAME,
    payload: {
        gameId: chessGame.gameId,
        opponentLevel: chessGame.opponentLevel,
        playerSide: chessGame.playerSide,
        chessMoves: chessGame.chessMoves,
        gameEnded: chessGame.gameEnded
    } as ChessReduceModel
});

const makeMove = (move: ChessMove) => ({
    type: MAKE_MOVE,
    payload: {
        move,
    }
});

const syncMoves = (moves: ChessMove[]) => ({
    type: SYNC_MOVES,
    payload: {
        moves,
    }
});

const endGame = () => ({
    type: END_GAME,
});

export { setChessGame, makeMove, syncMoves, endGame };