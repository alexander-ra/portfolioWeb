import {
    END_GAME,
    MAKE_MOVE,
    RESET_GAME,
    SET_CHESS_GAME,
    SET_OPPONENT_LEVEL,
    SET_PLAYER_SIDE,
    SYNC_MOVES
} from "./ChessActionTypes";
import AppStorage, {StorageKey} from "../../utils/AppStorage";
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

const initialId = AppStorage.getStorage(StorageKey.CHESS_GAME_ID);
const initialAvatar = AppStorage.getStorage(StorageKey.PLAYER_AVATAR);

const initialState: ChessReduceModel = {
    gameId: initialId,
    opponentLevel: undefined,
    playerSide: ChessSide.WHITE,
    playerAvatar: initialAvatar,
    chessMoves: [],
    gameStatus: ChessGameStatus.IN_PROGRESS
};

export default function chessReducer(state = initialState, action: any): ChessReduceModel {
    switch (action.type) {
        case SET_CHESS_GAME: {
            AppStorage.setStorage(StorageKey.CHESS_GAME_ID, action.payload.gameId);
            AppStorage.setStorage(StorageKey.PLAYER_AVATAR, action.payload.playerSide);
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
            return {
                ...state,
                chessMoves: action.payload.moves
            }
        }
        case END_GAME: {
            return {
                ...state,
                gameStatus: action.payload.gameStatus
            }
        }
        case RESET_GAME: {
            AppStorage.deleteStorage(StorageKey.CHESS_GAME_ID);
            return {
                ...state,
                ...initialState
            }
        }
        default:
            return state
    }
}