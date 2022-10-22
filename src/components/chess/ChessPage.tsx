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

interface LandingCubeProps {
    isClosing: boolean;
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

export interface ChessPiece {
    side: ChessSide,
    type: ChessPieceType,
    row: number;
    col: ChessLetters;
}

class ChessPage extends React.Component<LandingCubeProps> {
    private boardPieces: ChessPiece[] = [];

    constructor(props: LandingCubeProps) {
        super(props);

        this.initializeGame();
    }

    initializeGame(): void {
        for (let col = 1; col <= 8; col++) {
            this.boardPieces.push({
                side: ChessSide.WHITE,
                type: ChessPieceType.PAWN,
                row: 2,
                col: col
            });

            this.boardPieces.push({
                side: ChessSide.BLACK,
                type: ChessPieceType.PAWN,
                row: 7,
                col: col
            });
        }

        // White PIECES \/
        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.ROOK,
            row: 1,
            col: 1
        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.ROOK,
            row: 1,
            col: 8
        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.KNIGHT,
            row: 1,
            col: 2
        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.KNIGHT,
            row: 1,
            col: 7
        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.BISHOP,
            row: 1,
            col: 3
        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.BISHOP,
            row: 1,
            col: 6
        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.QUEEN,
            row: 1,
            col: 4
        });

        this.boardPieces.push({
            side: ChessSide.WHITE,
            type: ChessPieceType.KING,
            row: 1,
            col: 5
        });
        
        // BLACK PIECES \/

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.ROOK,
            row: 8,
            col: 1
        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.ROOK,
            row: 8,
            col: 8
        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.KNIGHT,
            row: 8,
            col: 2
        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.KNIGHT,
            row: 8,
            col: 7
        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.BISHOP,
            row: 8,
            col: 3
        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.BISHOP,
            row: 8,
            col: 6
        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.QUEEN,
            row: 8,
            col: 4
        });

        this.boardPieces.push({
            side: ChessSide.BLACK,
            type: ChessPieceType.KING,
            row: 8,
            col: 5
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

    rednderChessBoard(): JSX.Element[] {
        const chessRows: JSX.Element[] = [];
        for (let row = 1; row <= 8; row++) {
            let chessRow: JSX.Element[] = [];
            for (let col = 1; col <= 8; col++) {
                const pieceIndex = this.boardPieces.findIndex((piece: ChessPiece) => {
                    return piece.col === col && piece.row === row;
                })
                chessRow.push(<div className={`chess-square chess-square-${(row + col) % 2 === 0 ? "black" : "white"}`}>
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
            <div className={`chess-board-wrapper`}>
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

