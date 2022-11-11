import Utils from "./Utils";
import {
    ChessAiDifficulty,
    ChessMove,
    ChessPieceType,
    ChessSide,
    ChessSquare,
    ChessStartingSide,
    ChessUtils
} from "./ChessUtils";
import store from "../store/store";
import {
    endGame,
    makeMove,
    setChessGame,
    setOpponentLevel,
    setPlayerSide,
    syncMoves
} from "../reducers/chess/chessAction";
import {Buffer} from "buffer";
import { resetBoardState } from "../reducers/chessBoard/chessBoardAction";

export class ApiLichessUtils {
    private static readonly AUTH_KEY = "Bearer lip_ySt9nnwhXfyDdaO5InlE";
    private static readonly AI_LEVEL_EASY = 1;
    private static readonly AI_LEVEL_MEDIUM = 4;
    private static readonly AI_LEVEL_HARD = 8;
    private static readonly LICHESS_API_PREFIX = "https://lichess.org/api";

    private static getRequestHeaders(): Headers {
        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('Authorization', this.AUTH_KEY);
        return requestHeaders;
    }

    public static makeMove(move: ChessMove): void {
        const gameId = store.getState().chessReducer.gameId;
        store.dispatch(makeMove(move));
        const moveString = this.chessMoveToString(move);
        fetch(`${this.LICHESS_API_PREFIX}/bot/game/${gameId}/move/${moveString}`, {
            method: 'POST',
            headers: this.getRequestHeaders()
        })
        .catch(() => {}); // TODO: add reverse move if something went wrong
    }

    public static resignGame(): void {
        const gameId = store.getState().chessReducer.gameId;
        fetch(`${this.LICHESS_API_PREFIX}/bot/game/${gameId}/resign`, {
            method: 'POST',
            headers: this.getRequestHeaders()
        })
            .catch(() => {}); // TODO: handle resign
    }

    public static createNewGame(aiLevel: ChessAiDifficulty, playerSide: ChessStartingSide): void {
        store.dispatch(resetBoardState());
        let level: number;
        let color = playerSide.toLowerCase();
        switch (aiLevel) {
            case ChessAiDifficulty.EASY:
                level = this.AI_LEVEL_EASY;
                break;
            case ChessAiDifficulty.MEDIUM:
                level = this.AI_LEVEL_MEDIUM;
                break;
            case ChessAiDifficulty.HARD:
                level = this.AI_LEVEL_HARD;
                break;
            default:
                level = 1;
        }

        const data = new FormData();
        data.append("level", level.toString());
        data.append("days", "1");
        data.append("color", color);

        fetch(`${this.LICHESS_API_PREFIX}/challenge/ai`, {
            method: 'POST',
            headers: this.getRequestHeaders(),
            body: data
        }).then((response) => response.json())
        .then((response) => this.lichessResponseToModel(response, aiLevel, playerSide))
        .then((response) => {
            store.dispatch(setChessGame(response));
            this.getUpdatesForGame(response.gameId);
        })

    }

    public static async getUpdatesForGame(gameId?: number): Promise<any> {
        try {
            const response = await fetch(`${this.LICHESS_API_PREFIX}/bot/game/stream/${gameId}`, {
                method: 'GET',
                headers: this.getRequestHeaders()
            }) as any;
            const reader = response.body.getReader();

            while (true) {
                const {value, done} = await reader.read();
                if (done) break;
                const jsonString = Buffer.from(value).toString('utf8');

                if (jsonString.trim().length > 0) {
                    let parsedData = JSON.parse(jsonString);
                    parsedData = JSON.parse(jsonString);
                    const moves = [];
                    let state: any = {};
                    if (parsedData?.type === "gameFull") {
                        state = parsedData?.state;
                        let aiLevel: number;
                        if (parsedData?.black?.id && parsedData.black.id == "portfoliobot") {
                            store.dispatch(setPlayerSide(ChessSide.BLACK));
                            aiLevel = parsedData?.white?.aiLevel;
                        } else {
                            store.dispatch(setPlayerSide(ChessSide.WHITE));
                            aiLevel = parsedData?.black?.aiLevel;
                        }

                        //TODO: optimize store dispatching
                        switch (aiLevel) {
                            case this.AI_LEVEL_EASY:
                                store.dispatch(setOpponentLevel(ChessAiDifficulty.EASY));
                                break;
                            case this.AI_LEVEL_MEDIUM:
                                store.dispatch(setOpponentLevel(ChessAiDifficulty.MEDIUM));
                                break;
                            case this.AI_LEVEL_HARD:
                                store.dispatch(setOpponentLevel(ChessAiDifficulty.HARD));
                                break;
                        }
                    } else if (parsedData?.type === "gameState") {
                        state = parsedData;
                    }

                    if (state.moves) {
                        store.dispatch(syncMoves(this.getChessMovesFromString(state.moves)));
                    }

                    if (Utils.isNotNull(state.status) && state.status !== "started") {
                        store.dispatch(endGame());
                    }
                }
            }
        }
        catch (e: any) { // <-- note `e` has explicit `unknown` type
            throw new Error(`Error while getting chess game update: ${e}`);
        }
    }

    private static getChessMovesFromString(movesString: string): ChessMove[] {
        const movesArr = movesString.split(" ");
        const result: ChessMove[] = [];
        movesArr.forEach((stringMove) => {
            const from: ChessSquare = {
                col: ChessUtils.charToChessLetter(stringMove[0]),
                row: Number.parseInt(stringMove[1])
            };
            const to: ChessSquare ={
                col: ChessUtils.charToChessLetter(stringMove[2]),
                row: Number.parseInt(stringMove[3])
            };
            if (Utils.isNotNull(stringMove[4])) {
                result.push({
                    from,
                    to,
                    promoteTo: this.chessTypeFromLetter(stringMove[4])
                });
            } else {
                result.push({
                    from,
                    to,
                });
            }
        });
        return result;
    }

    private static chessTypeFromLetter(letter: string): ChessPieceType {
        switch (letter) {
            case "q":
                return ChessPieceType.QUEEN;
            case "r":
                return ChessPieceType.ROOK;
            case "b":
                return ChessPieceType.BISHOP;
            case "n":
                return ChessPieceType.KNIGHT;
            case "p":
                return ChessPieceType.PAWN;
            default:
                throw new Error(`Unknown chess piece type from string: ${letter}`);
        }
    }

    private static chessMoveToString(chessMove: ChessMove): string {
        const moveStr = ChessUtils.chessLetterToString(chessMove.from.col) + chessMove.from.row +
        ChessUtils.chessLetterToString(chessMove.to.col) + chessMove.to.row;
        if (Utils.isNotNull(chessMove.promoteTo)) {
            switch (chessMove.promoteTo) {
                case ChessPieceType.QUEEN:
                    return moveStr + 'q';
                case ChessPieceType.ROOK:
                    return moveStr + 'r';
                case ChessPieceType.BISHOP:
                    return moveStr + 'b';
                case ChessPieceType.KNIGHT:
                    return moveStr + 'n';
                case ChessPieceType.PAWN:
                    return moveStr + 'p';
                default:
                    return moveStr;
            }
        }
        return moveStr;
    }

    private static lichessResponseToModel(response: any, aiLevel: ChessAiDifficulty, playerAvatar: ChessStartingSide): any {
        const playerSide = response.player === "white" ? ChessSide.WHITE : ChessSide.BLACK;
        const moves: ChessMove[] = Utils.isArrayNotEmpty(response.moves) ? response.moves : []; //todo fix formating
        return {
            gameId: response.id,
            chessMoves: moves,
            opponentLevel: aiLevel,
            playerSide,
            playerAvatar,
            gameEnded: false
        };
    }
}