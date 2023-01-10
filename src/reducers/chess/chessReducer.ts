import {
    SET_STATUS,
    MAKE_MOVE,
    RESET_GAME,
    SET_CHESS_GAME,
    SET_OPPONENT_LEVEL,
    SET_PLAYER_SIDE,
    SYNC_MOVES
} from "./ChessActionTypes";
import StorageUtil, {StorageKey} from "../../utils/StorageUtil";
import {ChessGameStatus} from "../../models/chess/ChessGameStatus";
import { ChessAiDifficulty } from "../../models/chess/ChessAiDifficulty";
import { ChessSide } from "../../models/chess/ChessSide";
import { ChessStartingSide } from "../../models/chess/ChessStartingSide";
import { ChessMove } from "../../models/chess/ChessMove";

export interface ChessReduceModel {
    gameId?: number;
    opponentLevel?: ChessAiDifficulty;
    playerSide: ChessSide;
    playerAvatar: ChessStartingSide;
    chessMoves: ChessMove[];
    gameStatus: ChessGameStatus;
}
const initialAvatar = StorageUtil.getStorage(StorageKey.PLAYER_AVATAR);

export const initialState: ChessReduceModel = {
    gameId: StorageUtil.getStorage(StorageKey.CHESS_GAME_ID),
    opponentLevel: undefined,
    playerSide: ChessSide.WHITE,
    playerAvatar: initialAvatar,
    chessMoves: [],
    gameStatus: ChessGameStatus.NOT_STARTED
};

export default function chessReducer(state = initialState, action: any): ChessReduceModel {
    switch (action.type) {
        case SET_CHESS_GAME: {
            StorageUtil.setStorage(StorageKey.CHESS_GAME_ID, action.payload.gameId);
            StorageUtil.setStorage(StorageKey.PLAYER_AVATAR, action.payload.playerAvatar);
            return {
                ...state,
                gameId: action.payload.gameId,
                opponentLevel: action.payload.opponentLevel,
                playerSide: action.payload.playerSide,
                playerAvatar: action.payload.playerAvatar,
                chessMoves: action.payload.chessMoves,
                gameStatus: action.payload.gameStatus
            }
        }
        case SET_PLAYER_SIDE: {
            return {
                ...state,
                playerSide: action.payload.playerSide,
            }
        }
        case SET_OPPONENT_LEVEL: {
            return {
                ...state,
                opponentLevel: action.payload.opponentLevel,
            }
        }
        case MAKE_MOVE: {
            const newMoves = [...state.chessMoves, action.payload.move];
            return {
                ...state,
                chessMoves: newMoves
            }
        }
        case SYNC_MOVES: {
            const newMoves = state.gameStatus === ChessGameStatus.IN_PROGRESS ? action.payload.moves : state.chessMoves;

            return {
                ...state,
                chessMoves: newMoves
            }
        }
        case SET_STATUS: {
            return {
                ...state,
                gameStatus: action.payload.gameStatus
            }
        }
        case RESET_GAME: {
            StorageUtil.deleteStorage(StorageKey.CHESS_GAME_ID);
            return {
                gameId: null,
                opponentLevel: undefined,
                playerSide: ChessSide.WHITE,
                playerAvatar: initialAvatar,
                chessMoves: [],
                gameStatus: ChessGameStatus.NOT_STARTED
            }
        }
        default:
            return state
    }
}