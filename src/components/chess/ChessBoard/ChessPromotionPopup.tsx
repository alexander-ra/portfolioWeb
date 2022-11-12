import React from 'react';
import {connect} from 'react-redux';
import './ChessPromotionPopup.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ChessMove, ChessPieceType, ChessSide, ChessUtils} from "../../../utils/ChessUtils";
import {ApiLichessUtils} from "../../../utils/ApiLichessUtils";
import {ChessBoardModel} from "../../../reducers/chessBoard/chessBoardReducer";

interface ChessPromotionPopupProps {
    playerSide: ChessSide;
    potentialMove: ChessMove;
    onPromotionComplete: () => any;
}

class ChessPromotionPopup extends React.Component<ChessPromotionPopupProps> {
    private readonly PROMOTION_OPTIONS: ChessPieceType[] =
        [ChessPieceType.KNIGHT, ChessPieceType.BISHOP, ChessPieceType.ROOK, ChessPieceType.QUEEN];

    clickPromotion(promotion: ChessPieceType): void {
        const move = {
            from: this.props.potentialMove.from,
            to: this.props.potentialMove.to,
            promoteTo: promotion
        };
        ApiLichessUtils.makeMove(move);
        this.props.onPromotionComplete();
    }

    renderPromotionOptions(): JSX.Element[] {
        const promotionOptions: JSX.Element[] = [];
        this.PROMOTION_OPTIONS.forEach(option => {
            promotionOptions.push(
                <div className={`chess-piece chess-piece-${this.props.playerSide.toLowerCase()}`}
                     onClick={() =>this.clickPromotion(option)}>
                    <FontAwesomeIcon icon={ChessUtils.getPieceIcon(option)} />
                </div>
            );
        })
        return promotionOptions;
    }

    render(){
        return (<div className={`promotion-window`}>
            {this.renderPromotionOptions()}
        </div>)
    }
}

export default ChessPromotionPopup;

