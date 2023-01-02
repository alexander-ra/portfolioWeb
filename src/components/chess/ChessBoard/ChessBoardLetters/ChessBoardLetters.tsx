import React from 'react';
import { ChessLetters } from '../../../../models/chess/ChessLetters';
import './ChessBoardLetters.scss';

/**
 * ChessBoardLetters component. Represents the letters/numbers at the edge of the chess board.
 *
 * @author Alexander Andreev
 */
class ChessBoardLetters extends React.Component {
    private readonly CHESS_BOARD_SIDES: string[] = ["top", "right", "bottom", "left"];

    renderBoardLetters(): JSX.Element[] {
        const boardLetters: JSX.Element[][] = [];
        this.CHESS_BOARD_SIDES.forEach((side, index) => {
            boardLetters[index] = [];
            for (let letterIndex = 1; letterIndex <= 8; letterIndex++) {
                const letterValue = index % 2 == 0 ? ChessLetters[letterIndex] : letterIndex;
                boardLetters[index].push(
                    <div key={letterIndex}
                         className={`chess-letter chess-letter-${this.CHESS_BOARD_SIDES[index]} chess-letter-${letterValue}`}>
                        {letterValue}
                    </div>
                );
            }
        })
        return this.CHESS_BOARD_SIDES.map((side, index) => {
            return <div key={`${side}${index}`} className={`chess-letters chess-letters-${this.CHESS_BOARD_SIDES[index]}`}>{boardLetters[index]}</div>
        });
    }

    render(){
        return (<>{this.renderBoardLetters()}</>)
    }
}

export default ChessBoardLetters;

