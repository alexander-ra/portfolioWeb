import {ChessAiDifficulty, ChessMove, ChessSide, ChessStartingSide} from "../../utils/ChessUtils";
import {END_GAME, MAKE_MOVE, SET_CHESS_GAME, SET_OPPONENT_LEVEL, SET_PLAYER_SIDE, SYNC_MOVES} from "./ChessActionTypes";
import AppStorage, {StorageKey} from "../../utils/AppStorage";

export interface ChessReduceModel {
    gameId?: number;
    opponentLevel?: ChessAiDifficulty;
    playerSide: ChessSide;
    playerAvatar: ChessStartingSide;
    chessMoves: ChessMove[];
    gameEnded: boolean;
}

const initialId = AppStorage.getStorage(StorageKey.CHESS_GAME_ID);
const initialAvatar = AppStorage.getStorage(StorageKey.PLAYER_AVATAR);

const initialState: ChessReduceModel = {
    gameId: initialId,
    opponentLevel: undefined,
    playerSide: ChessSide.WHITE,
    playerAvatar: initialAvatar,
    chessMoves: [],
    gameEnded: false
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
                gameEnded: action.payload.gameEnded
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
                gameEnded: true
            }
        }
        default:
            return state
    }
}