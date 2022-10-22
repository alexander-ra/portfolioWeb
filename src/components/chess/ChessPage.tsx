import React from 'react';
import { connect } from 'react-redux';
import './ChessPage.scss';
import {Section} from "../contentPage/ContentPage";
import {
    faChessBishop, faChessKing, faChessKnight,
    faChessPawn, faChessQueen, faChessRook,
    faChevronLeft,
    faDotCircle,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { Buffer } from 'buffer';
import Utils from '../../utils/Utils';

interface LandingCubeProps {
    isClosing: boolean;
}

interface LandingCubeState {
    boardPieces: ChessPiece[];
    playerSide: ChessSide;
    squareFrom: ChessSquare | null;
    squareTo: ChessSquare | null;
}

export enum ChessLetters {
    A = 1,B = 2, C = 3, D = 4, E = 5, F = 6, G = 7, H = 8
}

export enum ChessSide {
    WHITE = "WHITE",
    BLACK = "BLACK",
}

export enum ChessPieceType {
    PAWN = "PAWN",
    KNIGHT = "KNIGHT",
    BISHOP = "BISHOP",
    ROOK = "ROOK",
    QUEEN = "QUEEN",
    KING = "KING"
}

export interface ChessSquare {
    row: number;
    col: ChessLetters;
}

export interface ChessPiece {
    side: ChessSide,
    type: ChessPieceType,
    square: ChessSquare;
}

class ChessPage extends React.Component<LandingCubeProps, LandingCubeState> {
    private boardPieces: ChessPiece[] = [];
    private processedMoves: number = 0;

    constructor(props: LandingCubeProps) {
        super(props);
        this.state = {
            boardPieces: [],
            playerSide: ChessSide.WHITE,
            squareFrom: null,
            squareTo: null
        };

        this.initializeGame();
        this.test();
    }

    async test(): Promise<any> {
        const requestHeaders: HeadersInit = new Headers();
        // requestHeaders.set('Content-Type', 'application/x-ndjson');
        requestHeaders.set('Authorization', 'Bearer lip_ySt9nnwhXfyDdaO5InlE');

        const response = await fetch("https://lichess.org/api/bot/game/stream/MBOBo3dd1UOu", {
            method: 'GET',
            headers: requestHeaders
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
                    if (parsedData?.state?.moves) {
                        this.changeBoard(parsedData.state.moves);
                    }
                    if (parsedData?.moves) {
                        this.changeBoard(parsedData.moves);
                    }
                    if (parsedData?.black?.id && parsedData.black.id == "portfoliobot") {
                        this.setState({playerSide: ChessSide.BLACK});
                    }
                }
                catch (e: any) { // <-- note `e` has explicit `unknown` type
                    parsedData = "PROBLEM";
                    console.log("the problem is ", jsonString)
                }

                console.log('Received', parsedData);
            }
        }
    }

    quickAdapter(col: ChessLetters | undefined): string {
        switch (col) {
            case ChessLetters.A: return "a"
            case ChessLetters.B: return "b"
            case ChessLetters.C: return "c"
            case ChessLetters.D: return "d"
            case ChessLetters.E: return "e"
            case ChessLetters.F: return "f"
            case ChessLetters.G: return "g"
            case ChessLetters.H: return "h"
        }
        return "0";
    }

    quickAdapterRev(col: string): ChessLetters {
        switch (col) {
            case "a": return ChessLetters.A
            case "b": return ChessLetters.B
            case "c": return ChessLetters.C
            case "d": return ChessLetters.D
            case "e": return ChessLetters.E
            case "f": return ChessLetters.F
            case "g": return ChessLetters.G
            case "h": return ChessLetters.H
            default: throw (new Error());
        }
        return ChessLetters.H;
    }

    changeBoard(moveStr: string): void {
        const moves = moveStr.split(" ");
        if (Utils.isArrayNotEmpty(moves)) {
            while (this.processedMoves < moves.length) {
                let i = this.processedMoves;
                const currentPos = {
                    col: moves[i][0],
                    row: moves[i][1]
                };
                const nextPos ={
                    col: moves[i][2],
                    row: moves[i][3]
                };
                const index = this.boardPieces.findIndex((move) => {
                    return this.quickAdapter(move.square.col) === currentPos.col && move.square.row.toString() === currentPos.row;
                })
                const deadIndex = this.boardPieces.findIndex((move) => {
                    return this.quickAdapter(move.square.col) === nextPos.col && move.square.row.toString() === nextPos.row;
                })
                if (deadIndex !== -1) {
                    this.boardPieces[deadIndex].square.row = 200; //TODO delete dead piece
                }
                if (index !== -1) {
                    this.boardPieces[index].square.row = Number.parseInt(nextPos.row);
                    this.boardPieces[index].square.col = this.quickAdapterRev(nextPos.col);
                    this.processedMoves++;
                } else {
                    //TODO: throw err;
                }

                this.setState({boardPieces: []} );
            }
        }
    }

    initializeGame(): void {
        for (let col = 1; col <= 8; col++) {
            this.boardPieces.push({
                side: ChessSide.WHITE,
                type: ChessPieceType.PAWN,
                square: {
                    row: 2,
                    col: col
                }
            });

            this.boardPieces.push({
                side: ChessSide.BLACK,
                type: ChessPieceType.PAWN,
                square: {
                    row: 7,
                    col: col
                }
            });
        }

        // White PIECES \/
        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.ROOK,
            square: {
                row: 1,
                col: 1
            }
        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.ROOK,
            square: {
                row: 1,
                col: 8
            }

        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.KNIGHT,
            square: {
                row: 1,
                col: 2
            }

        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.KNIGHT,
            square: {
                row: 1,
                col: 7
            }

        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.BISHOP,
            square: {
                row: 1,
                col: 3
            }

        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.BISHOP,
            square: {
                row: 1,
                col: 6
            }

        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.QUEEN,
            square: {
                row: 1,
                col: 4
            }

        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.KING,
            square: {
                row: 1,
                col: 5
            }

        });
        
        // BLACK PIECES \/

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.ROOK,
            square: {
                row: 8,
                col: 1
            }

        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.ROOK,
            square: {
                row: 8,
                col: 8
            }

        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.KNIGHT,
            square: {
                row: 8,
                col: 2
            }

        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.KNIGHT,
            square: {
                row: 8,
                col: 7
            }

        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.BISHOP,
            square: {
                row: 8,
                col: 3
            }

        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.BISHOP,
            square: {
                row: 8,
                col: 6
            }

        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.QUEEN,
            square: {
                row: 8,
                col: 4
            }

        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.KING,
            square: {
                row: 8,
                col: 5
            }

        });
    }

    getPieceIcon(pieceType: ChessPieceType): IconDefinition {

        switch (pieceType) {
            case ChessPieceType.PAWN:
                return faChessPawn
            case ChessPieceType.BISHOP:
                return faChessBishop
            case ChessPieceType.KNIGHT:
                return faChessKnight
            case ChessPieceType.ROOK:
                return faChessRook
            case ChessPieceType.QUEEN:
                return faChessQueen
            case ChessPieceType.KING:
                return faChessKing
        }
        return faDotCircle;
    }

    clickSquare(square: ChessSquare): void {
        if (Utils.isNotNull(this.state.squareFrom)) {
            if (this.state.squareFrom?.row === square.row && this.state.squareFrom?.col === square.col) {
                this.setState({squareFrom: null});
            } else {
                const requestHeaders: HeadersInit = new Headers();
                // requestHeaders.set('Content-Type', 'application/x-ndjson');
                requestHeaders.set('Authorization', 'Bearer lip_ySt9nnwhXfyDdaO5InlE');
                const move = this.quickAdapter(this.state.squareFrom?.col) + this.state.squareFrom?.row + this.quickAdapter(square.col) + square.row;
                this.setState({squareFrom: null});
                fetch(`https://lichess.org/api/bot/game/MBOBo3dd1UOu/move/${move}`, {
                    method: 'POST',
                    headers: requestHeaders
                })
                .then((data) => console.log(data));
            }
        } else {
            this.setState({squareFrom: square})
        }
    }

    rednderChessBoard(): JSX.Element[] {
        const chessRows: JSX.Element[] = [];
        for (let row = 1; row <= 8; row++) {
            let chessRow: JSX.Element[] = [];
            for (let col = 1; col <= 8; col++) {
                const pieceIndex = this.boardPieces.findIndex((piece: ChessPiece) => {
                    return piece.square.col === col && piece.square.row === row;
                })
                chessRow.push(<div className={`chess-square chess-square-${(row + col) % 2 === 0 ? "black" : "white"} 
                ${this.state.squareFrom?.row === row && this.state.squareFrom?.col === col ? "clicked-square" : ""}`}
                                   onClick={() => {this.clickSquare({col,row})}}>
                    { pieceIndex !== -1 && <div className={`chess-piece chess-piece-${this.boardPieces[pieceIndex].side.toLowerCase()}`}>
                        <FontAwesomeIcon className={"back-icon"} icon={this.getPieceIcon(this.boardPieces[pieceIndex].type)} />
                    </div>

                    }
                </div>);
            }
            chessRows.push(<div className={`chess-row`}>
                {chessRow}
            </div>
            );
        }
        return chessRows;
    }

    rednderBoardLetters(): JSX.Element[] {
        const boardLettersTop: JSX.Element[] = [];
        const boardLettersRight: JSX.Element[] = [];
        const boardLettersDown: JSX.Element[] = [];
        const boardLettersLeft: JSX.Element[] = [];
        for (let letterIndex = 1; letterIndex <= 8; letterIndex++) {
            boardLettersTop.push(<div className={`chess-letter chess-letter-top chess-letter-${ChessLetters[letterIndex]}`}>{ChessLetters[letterIndex]}</div>);
            boardLettersRight.push(<div className={`chess-letter chess-letter-right chess-letter-${letterIndex}`}>{letterIndex}</div>);
            boardLettersDown.push(<div className={`chess-letter chess-letter-bottom chess-letter-${ChessLetters[letterIndex]}`}>{ChessLetters[letterIndex]}</div>);
            boardLettersLeft.push(<div className={`chess-letter chess-letter-left chess-letter-${letterIndex}`}>{letterIndex}</div>);
        }
        return [
            <div className={`chess-letters chess-letters-top`}>{boardLettersTop}</div>,
            <div className={`chess-letters chess-letters-right`}>{boardLettersRight}</div>,
            <div className={`chess-letters chess-letters-bottom`}>{boardLettersDown}</div>,
            <div className={`chess-letters chess-letters-left`}>{boardLettersLeft}</div>];
    }

    render(){
        return (<div className={`chess-page-wrapper ${this.props.isClosing ? "closing" : ""}`}>
            <div className={`chess-board-wrapper ${this.state.playerSide.toLowerCase()}-player-view`}>
                {this.rednderChessBoard()}
                {this.rednderBoardLetters()}
            </div>
        </div>)
    }
}

export default connect(
    (state: any, ownProps) => {
        return {
            ...ownProps,
        }
    }
)(ChessPage);

