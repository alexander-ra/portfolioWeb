import Utils from "./Utils";
import {ChessAiDifficulty, ChessMove, ChessSide, ChessSquare, ChessUtils} from "./ChessUtils";
import {ChessReduceModel} from "../reducers/chess/chessReducer";
import store from "../store/store";
import {SET_CHESS_GAME} from "../reducers/chess/ChessActionTypes";
import {makeMove, setChessGame, syncMoves} from "../reducers/chess/chessAction";
import {Buffer} from "buffer";

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
        const moveString = this.chessMoveToString(move);
        fetch(`https://lichess.org/api/bot/game/${gameId}/move/${moveString}`, {
            method: 'POST',
            headers: this.getRequestHeaders()
        })
        .then((data) => {
            store.dispatch(makeMove(move));
        })
        .catch(() => {});
    }

    public static getNewGame(aiLevel: ChessAiDifficulty, playerSide: ChessSide): void {
        let level: number;
        let color = Utils.isNotNull(playerSide) ? playerSide.toLowerCase() : "random";
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
        .then((response) => this.lichessResponseToModel(response, aiLevel))
        .then((response) => {
            store.dispatch(setChessGame(response));
            this.getUpdatesForGame(response.gameId);
        })

    }

    public static async getUpdatesForGame(gameId?: number): Promise<any> {

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
                let parsedData;
                try {
                    parsedData = JSON.parse(jsonString);
                    const moves = [];
                    if (parsedData?.state?.moves) {
                        store.dispatch(syncMoves(this.getChessMovesFromString(parsedData.state.moves)))
                    }
                    if (parsedData?.moves) {
                        store.dispatch(syncMoves(this.getChessMovesFromString(parsedData.moves)))
                    }
                    //TODO remove if no problems without it
                    // if (parsedData?.black?.id && parsedData.black.id == "portfoliobot") {
                    //     this.setState({playerSide: ChessSide.BLACK});
                    // }
                }
                catch (e: any) { // <-- note `e` has explicit `unknown` type
                    throw new Error(`Error while getting chess game update: ${e}`);
                }
            }
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
            result.push({
                from,
                to
            });
        });
        return result;
    }

    private static chessMoveToString(chessMove: ChessMove): string {
        return ChessUtils.chessLetterToString(chessMove.from.col) + chessMove.from.row +
        ChessUtils.chessLetterToString(chessMove.to.col) + chessMove.to.row;
    }

    private static lichessResponseToModel(response: any, aiLevel: ChessAiDifficulty): ChessReduceModel {
        const playerSide = response.player === "white" ? ChessSide.WHITE : ChessSide.BLACK;
        const moves: ChessMove[] = Utils.isArrayNotEmpty(response.moves) ? response.moves : []; //todo fix formating
        return {
            gameId: response.id,
            chessMoves: moves,
            opponentLevel: aiLevel,
            playerSide
        };
    }
}