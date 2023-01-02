import React from 'react';
import './ConfiguratorSection.scss';
import {connect} from 'react-redux';
import { ChessSide } from '../../../models/chess/ChessSide';

interface ConfigurationSectionProps {
    onSelectChange: (selectedIndex: number) => void;
    items: string[];
    selectedIndex: number;
}
class ConfigurationSection extends React.Component<ConfigurationSectionProps> {

    constructor(props: ConfigurationSectionProps) {
        super(props);
    }

    private renderItems = (): JSX.Element[] => {
        const items: JSX.Element[] = [];
        this.props.items.forEach((item, index) => {
            items.push(<div className={`setting-${item.toLowerCase()} setting ${this.props.selectedIndex === index ? "selected": ""}`}
                            onClick={() => this.props.onSelectChange(index)} key={item}>
                <div className={"setting-label"}>{item.charAt(0).toUpperCase() + item.toLowerCase().slice(1)}</div>
            </div>)
        })
        return items;
    }

    render(){
        return <>
            <div className={"settings-wrapper"}>
                {this.renderItems()}
            </div>
        </>;
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
    })(ConfigurationSection);

