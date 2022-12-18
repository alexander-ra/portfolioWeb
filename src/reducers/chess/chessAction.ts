import {CubeMenuStates} from "../../models/landing/CubeMenuStates";
import {MAKE_MOVE, SYNC_MOVES, SET_CHESS_GAME, END_GAME, SET_PLAYER_SIDE, SET_OPPONENT_LEVEL, RESET_GAME} from "./ChessActionTypes";
import {CubeReduceModel} from "../cube/cubeReducer";
import {ChessReduceModel} from "./chessReducer";
import { ChessSide } from "../../models/chess/ChessSide";
import { ChessAiDifficulty } from "../../models/chess/ChessAiDifficulty";
import { ChessMove } from "../../models/chess/ChessMove";
import {ChessGameStatus} from "../../models/chess/ChessGameStatus";

const setChessGame = (chessGame: ChessReduceModel) => ({
    type: SET_CHESS_GAME,
    payload: {
        gameId: chessGame.gameId,
        opponentLevel: chessGame.opponentLevel,
        playerSide: chessGame.playerSide,
        playerAvatar: chessGame.playerAvatar,
        chessMoves: chessGame.chessMoves,
        gameStatus: chessGame.gameStatus
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

const endGame = (gameStatus: ChessGameStatus) => ({
    type: END_GAME,
    payload: {
        gameStatus,
    }
});

const resetGame = () => ({
    type: RESET_GAME
});

export { setChessGame, setPlayerSide, setOpponentLevel, makeMove, syncMoves, endGame, resetGame };