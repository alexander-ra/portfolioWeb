import React from 'react';
import './ChessGameConfigurator.scss';
import {connect} from 'react-redux';
import Utils from '../../../utils/Utils';
import ConfigurationSection from "./ConfiguratorSection";
import {ApiLichessUtils} from "../../../utils/ApiLichessUtils";
import { ChessAiDifficulty } from '../../../models/chess/ChessAiDifficulty';
import { ChessStartingSide } from '../../../models/chess/ChessStartingSide';
import { ChessSide } from '../../../models/chess/ChessSide';
import {CommonLabels} from "../../../provision/CommonLabels";

interface ChessGameConfiguratorProps {
}

interface ChessGameConfiguratorState {
    selectedOpponentIndex: number;
    startingPositionIndex: number
    playButtonAvailable: boolean;
}

/**
 * ChessGameConfigurator component. This component is responsible for configuring the chess game.
 *
 * @author Alexander Andreev
 */
class ChessGameConfigurator extends React.Component<ChessGameConfiguratorProps, ChessGameConfiguratorState> {
    private readonly PLAY_CHESS_TIMEOUT_TIME = 3000;
    private playChessTimeout: any;

    constructor(props: ChessGameConfiguratorProps) {
        super(props);
        this.state = {
            selectedOpponentIndex: null,
            startingPositionIndex: null,
            playButtonAvailable: true
        };
    }

    /**
     * Start button should be disabled if the user has not selected an opponent, a starting position or the user already clicked the button.
     */
    private startButtonDisabled = (): boolean => {
        return Utils.isNull(this.state.selectedOpponentIndex) || Utils.isNull(this.state.startingPositionIndex) || !this.state.playButtonAvailable;
    }

    /**
     * Retrieves all the values in an enum as array of strings.
     * @param enumeration The enum to retrieve the values from.
     * @private
     */
    private enumToArray(enumeration: any): string[] {
        return Object.keys(enumeration).map(key => (enumeration[key]))
    }

    /**
     * Send a request to the server to start a chess game. Disable the button for a few seconds to prevent multiple clicks.
     * @private
     */
    private playChess() {
        this.setState({playButtonAvailable: false});
        ApiLichessUtils.createNewGame(Object.values(ChessAiDifficulty)[this.state.selectedOpponentIndex], Object.values(ChessStartingSide)[this.state.startingPositionIndex]);
        setTimeout(() => {
            this.setState({playButtonAvailable: true});
        }, this.PLAY_CHESS_TIMEOUT_TIME);
    }

    render(){
        return <div className={"chess-configurator-wrapper"}>
            <div className={"setting-title"}>{CommonLabels.PICK_OPPONENT}</div>
            <ConfigurationSection selectedIndex={this.state.selectedOpponentIndex}
                                  onSelectChange={(index: number) => {this.setState({selectedOpponentIndex: index})}}
                                  items={this.enumToArray(ChessAiDifficulty)} />
            <div className={"setting-title"}>{CommonLabels.PICK_A_SIDE}</div>
            <ConfigurationSection selectedIndex={this.state.startingPositionIndex}
                                  onSelectChange={(index: number) => {this.setState({startingPositionIndex: index})}}
                                  items={this.enumToArray(ChessStartingSide)} />
            <button disabled={this.startButtonDisabled()}
                    className={"play-button"}
                    onClick={this.playChess.bind(this)}>
                {CommonLabels.PLAY_CHESS}
            </button>

        </div>;
    }
}

export default connect(
    (state: any, ownProps) => {
        const { gameId, opponentLevel, playerSide, chessMoves, gameEnded } = state.chessReducer;
        return {
            ...ownProps,
            chessGameId: gameId,
            opponentLevel,
            playerSide,
            opponentSide: playerSide === ChessSide.WHITE ? ChessSide.BLACK : ChessSide.WHITE,
            chessMoves,
            gameEnded
        }
    })(ChessGameConfigurator);

