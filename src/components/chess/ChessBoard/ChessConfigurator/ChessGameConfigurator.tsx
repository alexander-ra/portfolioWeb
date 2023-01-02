import React from 'react';
import './ChessGameConfigurator.scss';
import {connect} from 'react-redux';
import Utils from '../../../../utils/Utils';
import ConfigurationSection from "./ConfiguratorSection";
import {ApiLichessUtils} from "../../../../utils/ApiLichessUtils";
import { ChessAiDifficulty } from '../../../../models/chess/ChessAiDifficulty';
import { ChessStartingSide } from '../../../../models/chess/ChessStartingSide';
import { ChessSide } from '../../../../models/chess/ChessSide';

interface ChessGameConfiguratorProps {
}

interface ChessGameConfiguratorState {
    selectedOpponentIndex: number;
    startingPositionIndex: number
    playButtonAvailable: boolean;
}

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

    private startButtonDisabled = (): boolean => {
        return Utils.isNull(this.state.selectedOpponentIndex) || Utils.isNull(this.state.startingPositionIndex) || !this.state.playButtonAvailable;
    }

    private enumToArray(enumeration: any): string[] {

        return Object.keys(enumeration).map(key => (enumeration[key]))
    }

    private playChess() {
        this.setState({playButtonAvailable: false});
        ApiLichessUtils.createNewGame(Object.values(ChessAiDifficulty)[this.state.selectedOpponentIndex], Object.values(ChessStartingSide)[this.state.startingPositionIndex]);
        setTimeout(() => {
            this.setState({playButtonAvailable: true});
        }, this.PLAY_CHESS_TIMEOUT_TIME);
    }

    render(){
        return <div className={"chess-configurator-wrapper"}>
            <div className={"setting-title"}>Pick Opponent</div>
            <ConfigurationSection selectedIndex={this.state.selectedOpponentIndex}
                                  onSelectChange={(index: number) => {this.setState({selectedOpponentIndex: index})}}
                                  items={this.enumToArray(ChessAiDifficulty)} />
            <div className={"setting-title"}>Pick a Side</div>
            <ConfigurationSection selectedIndex={this.state.startingPositionIndex}
                                  onSelectChange={(index: number) => {this.setState({startingPositionIndex: index})}}
                                  items={this.enumToArray(ChessStartingSide)} />
            <button disabled={this.startButtonDisabled()}
                    className={"play-button"}
                    onClick={this.playChess.bind(this)}>
                Play chess
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

