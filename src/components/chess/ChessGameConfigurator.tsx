import React from 'react';
import {ChessAiDifficulty, ChessSide, ChessStartingSide} from '../../utils/ChessUtils';
import './ChessGameConfigurator.scss';
import {connect} from 'react-redux';
import Utils from '../../utils/Utils';
import ConfigurationSection from "./ConfiguratorSection";
import {ApiLichessUtils} from "../../utils/ApiLichessUtils";

interface ChessGameConfiguratorProps {
}

interface ChessGameConfiguratorState {
    selectedOpponentIndex: number;
    startingPositionIndex: number
}

class ChessGameConfigurator extends React.Component<ChessGameConfiguratorProps, ChessGameConfiguratorState> {

    constructor(props: ChessGameConfiguratorProps) {
        super(props);
        this.state = {
            selectedOpponentIndex: null,
            startingPositionIndex: null
        };
    }

    private startButtonDisabled = (): boolean => {
        return Utils.isNull(this.state.selectedOpponentIndex) || Utils.isNull(this.state.startingPositionIndex);
    }

    private enumToArray(enumeration: any): string[] {

        return Object.keys(enumeration).map(key => (enumeration[key]))
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
                    onClick={() => {
                        ApiLichessUtils.createNewGame(Object.values(ChessAiDifficulty)[this.state.selectedOpponentIndex], Object.values(ChessStartingSide)[this.state.startingPositionIndex]);
                    }}>
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

