import React from 'react';
import './ChessBoardEndgameMessage.scss';
import {faChevronLeft, faFaceSadCry, faHandshakeAngle, faPeace, faStar, faTrophy} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ApiLichessUtils} from "../../../utils/ApiLichessUtils";
import { ChessGameStatus } from '../../../models/chess/ChessGameStatus';

interface ChessBoardEndgameMessageProps {
    gameStatus: ChessGameStatus;
}

class ChessBoardEndgameMessage extends React.Component<ChessBoardEndgameMessageProps> {
    private readonly CHESS_BOARD_SIDES: string[] = ["top", "right", "bottom", "left"];

    getChessMessage(): string {
        switch (this.props.gameStatus) {
            case ChessGameStatus.WIN:
                return "You won! Congratulations!";
            case ChessGameStatus.LOSS:
                return "You lost! Better luck next time!";
            case ChessGameStatus.DRAW:
                return "It's a draw! Better luck next time!";
            default:
                return "This game cannot continue!";
        }
    }

    getChessIcon(): JSX.Element {
        switch (this.props.gameStatus) {
            case ChessGameStatus.WIN:
                return <>
                    <div className={"stars-wrapper"}>
                        <FontAwesomeIcon className={"star star-left"} icon={faStar} />
                        <FontAwesomeIcon className={"star star-center"} icon={faStar} />
                        <FontAwesomeIcon className={"star star-right"} icon={faStar} />
                    </div>
                    <FontAwesomeIcon className={"chess-message-icon"} icon={faTrophy} />
                </>
            case ChessGameStatus.LOSS:
                return <FontAwesomeIcon className={"chess-message-icon"} icon={faFaceSadCry} />
            case ChessGameStatus.DRAW:
                return <FontAwesomeIcon className={"chess-message-icon"} icon={faHandshakeAngle} />
            default:
                return <FontAwesomeIcon className={"chess-message-icon"} icon={faPeace} />
        }
    }

    render(){
        return (
            <div className={"chess-message-wrapper"}>
                <div className={`chess-message-icon-wrapper ${this.props.gameStatus === ChessGameStatus.WIN ? "win" : ""}`}>
                    {this.getChessIcon()}
                </div>
                <div className={"chess-message"}>
                    <div className={"chess-message-label"}>
                        {this.getChessMessage()}
                    </div>
                    <div className={"play-again-button"}>
                        <button onClick={() => {ApiLichessUtils.resignGame()}}>Play again</button>
                    </div>
                </div>
            </div>)
    }
}

export default ChessBoardEndgameMessage;

