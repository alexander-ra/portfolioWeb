import {ChessAiDifficulty, ChessMove, ChessSide} from "../../utils/ChessUtils";
import {MAKE_MOVE, SET_CHESS_GAME, SYNC_MOVES} from "./ChessActionTypes";
import AppStorage, {StorageKey} from "../../utils/AppStorage";

export interface ChessReduceModel {
    gameId?: number;
    opponentLevel?: ChessAiDifficulty;
    playerSide: ChessSide;
    chessMoves: ChessMove[];
}

const test = AppStorage.getStorage(StorageKey.CHESS_GAME_ID);

const initialState: ChessReduceModel = {
    gameId: test,
    opponentLevel: undefined,
    playerSide: ChessSide.WHITE,
    chessMoves: []
};

export default function chessReducer(state = initialState, action: any): ChessReduceModel {
    switch (action.type) {
        case SET_CHESS_GAME: {
            AppStorage.setStorage(StorageKey.CHESS_GAME_ID, action.payload.gameId);
            return {
                ...state,
                gameId: action.payload.gameId,
                opponentLevel: action.payload.opponentLevel,
                playerSide: action.payload.playerSide,
                chessMoves: action.payload.chessMoves
            }
        }
        case MAKE_MOVE: {
            const newMoves = [...state.chessMoves, ...action.payload.move];
            return {
                ...state,
                chessMoves: newMoves
            }
        }
        case SYNC_MOVES: {
            return {
                ...state,
                chessMoves: action.payload.moves
            }
        }
        default:
            return state
    }
}