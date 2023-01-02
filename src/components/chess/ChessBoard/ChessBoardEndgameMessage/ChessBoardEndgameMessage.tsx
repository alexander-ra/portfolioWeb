import React from 'react';
import './ChessBoardEndgameMessage.scss';
import {ApiLichessUtils} from "../../../../utils/ApiLichessUtils";
import { ChessGameStatus } from '../../../../models/chess/ChessGameStatus';
import Icon from '../../../common/Icon/Icon';
import { IconType } from '../../../../models/common/IconType';
import {CommonLabels} from "../../../../provision/CommonLabels";

interface ChessBoardEndgameMessageProps {
    gameStatus: ChessGameStatus;
}

class ChessBoardEndgameMessage extends React.Component<ChessBoardEndgameMessageProps> {
    private readonly CHESS_BOARD_SIDES: string[] = ["top", "right", "bottom", "left"];

    getChessMessage(): string {
        switch (this.props.gameStatus) {
            case ChessGameStatus.WIN:
                return CommonLabels.CHESS_WIN;
            case ChessGameStatus.LOSE:
                return CommonLabels.CHESS_LOSE;
            case ChessGameStatus.DRAW:
                return CommonLabels.CHESS_DRAW;
            default:
                return CommonLabels.CHESS_INTERRUPTED;
        }
    }

    getChessIcon(): JSX.Element {
        switch (this.props.gameStatus) {
            case ChessGameStatus.WIN:
                return <>
                    <div className={"stars-wrapper"}>
                        <Icon className={"star star-left"} icon={IconType.faStar} />
                        <Icon className={"star star-center"} icon={IconType.faStar} />
                        <Icon className={"star star-right"} icon={IconType.faStar} />
                    </div>
                    <Icon className={"chess-message-icon"} icon={IconType.faTrophy} />
                </>
            case ChessGameStatus.LOSE:
                return <Icon className={"chess-message-icon"} icon={IconType.faFaceSadCry} />
            case ChessGameStatus.DRAW:
                return <Icon className={"chess-message-icon"} icon={IconType.faHandshakeAngle} />
            default:
                return <Icon className={"chess-message-icon"} icon={IconType.faPeace} />
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
                        <button onClick={() => {ApiLichessUtils.resignGame()}}>{CommonLabels.PLAY_AGAIN}</button>
                    </div>
                </div>
            </div>)
    }
}

export default ChessBoardEndgameMessage;

