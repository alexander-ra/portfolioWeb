import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {MAKE_MOVE, SYNC_MOVES, SET_CHESS_GAME, END_GAME, SET_PLAYER_SIDE, SET_OPPONENT_LEVEL} from "./ChessActionTypes";
import {CubeReduceModel} from "../cube/cubeReducer";
import {ChessReduceModel} from "./chessReducer";
import {ChessAiDifficulty, ChessMove, ChessSide} from "../../utils/ChessUtils";

const setChessGame = (chessGame: ChessReduceModel) => ({
    type: SET_CHESS_GAME,
    payload: {
        gameId: chessGame.gameId,
        opponentLevel: chessGame.opponentLevel,
        playerSide: chessGame.playerSide,
        playerAvatar: chessGame.playerAvatar,
        chessMoves: chessGame.chessMoves,
        gameEnded: chessGame.gameEnded
    } as ChessReduceModel
});

const setPlayerSide = (playerSide: ChessSide) => ({
    type: SET_PLAYER_SIDE,
    payload: {
        playerSide: playerSide
    } as ChessReduceModel
});

const setOpponentLevel = (opponentLevel: ChessAiDifficulty) => ({
    type: SET_OPPONENT_LEVEL,
    payload: {
        opponentLevel
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

export { setChessGame, setPlayerSide, setOpponentLevel, makeMove, syncMoves, endGame };