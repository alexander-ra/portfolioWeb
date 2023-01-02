import React from 'react';
import {connect} from 'react-redux';
import './ChessPromotionPopup.scss';
import {ApiLichessUtils} from "../../../../utils/ApiLichessUtils";
import {ChessBoardModel} from "../../../../reducers/chessBoard/chessBoardReducer";
import { ChessSide } from '../../../../models/chess/ChessSide';
import { ChessMove } from '../../../../models/chess/ChessMove';
import { ChessPieceType } from '../../../../models/chess/ChessPieceType';
import { ChessUtils } from '../../../../utils/ChessUtils';
import Icon from '../../../common/Icon/Icon';

interface ChessPromotionPopupProps {
    playerSide: ChessSide;
    potentialMove: ChessMove;
    onPromotionComplete: () => any;
}

/**
 * ChessPromotionPopup component. Represents a popup that appears when a pawn reaches the end of the board.
 *
 * @author Alexander Andreev
 */
class ChessPromotionPopup extends React.Component<ChessPromotionPopupProps> {
    private readonly PROMOTION_OPTIONS: ChessPieceType[] =
        [ChessPieceType.KNIGHT, ChessPieceType.BISHOP, ChessPieceType.ROOK, ChessPieceType.QUEEN];


    /**
     * Finalizes the promotion of the pawn.
     * @param promotion - the type of the piece to promote the pawn to
     */
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
                    <Icon icon={ChessUtils.getPieceIcon(option)} />
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

