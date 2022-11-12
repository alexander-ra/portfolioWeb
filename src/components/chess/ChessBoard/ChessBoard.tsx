import React from 'react';
import {connect} from 'react-redux';
import './ChessBoard.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Utils from '../../../utils/Utils';
import {ApiLichessUtils} from "../../../utils/ApiLichessUtils";
import AppStorage, {StorageKey} from "../../../utils/AppStorage";
import ChessGameConfigurator from "./ChessConfigurator/ChessGameConfigurator";
import ChessBoardLetters from "./ChessBoardLetters";
import ChessPromotionPopup from "./ChessPromotionPopup";
import ChessPlayers from "./ChessBoardPlayers";
import ChessBoardSquare from "./ChessBoardSquare";
import {CastleInfo, ChessPiece, ChessMove, ChessSide, ChessSquare, ChessUtils, ChessPieceType } from '../../../utils/ChessUtils';

interface ChessBoardProps {
    chessGameId: number;
    playerSide: ChessSide;
    chessMoves: ChessMove[];
    gameEnded: boolean;
    chessPieces: ChessPiece[];
    castleInfo: CastleInfo;
}

interface ChessBoardState {
    selectedSquare: ChessSquare;
}

class ChessBoard extends React.Component<ChessBoardProps, ChessBoardState> {
    private possibleMoves: ChessSquare[] = [];
    private promotionMove: ChessSquare;
    private enPassantSquare: ChessSquare;

    constructor(props: ChessBoardProps) {
        super(props);
        this.state = {
            selectedSquare: null,
        };

        if (Utils.isNull(this.props.chessGameId)) {
            const savedGameId = AppStorage.getStorage(StorageKey.CHESS_GAME_ID);
            if (Utils.isNotNull(savedGameId)) {
                ApiLichessUtils.getUpdatesForGame(savedGameId);
            }
        }

        if (Utils.isNotNull(this.props.chessGameId)) {
            ApiLichessUtils.getUpdatesForGame(this.props.chessGameId);
        }
    }

    componentDidUpdate(prevProps: Readonly<ChessBoardProps>, prevState: Readonly<ChessBoardState>, snapshot?: any) {
        if (Utils.isArrayEmpty(this.props.chessPieces) ||
            (Utils.isArrayNotEmpty(this.props.chessMoves) && prevProps.chessMoves.length !== this.props.chessMoves.length)) {
            ChessUtils.processMoves(this.props.chessMoves);
        }
        if (prevState.selectedSquare !== this.state.selectedSquare) {
            this.promotionMove = null;
            if (Utils.isNotNull(this.state.selectedSquare)) {
                this.possibleMoves = ChessUtils.calculatePossibleMoves(this.state.selectedSquare, this.props.chessPieces,
                    this.props.playerSide, false, this.props.castleInfo);
            } else {
                this.possibleMoves = [];
            }
            this.setState({});
        }
    }

    clickSquare(square: ChessSquare): void {
        if (Utils.isNotNull(this.state.selectedSquare)) {
            if (ChessUtils.chessSquaresEqual(this.state.selectedSquare, square)) {
                this.setState({selectedSquare: null});
            } else if (ChessUtils.squareOnSidePiece(square, this.props.chessPieces, this.props.playerSide)) {
                this.setState({selectedSquare: square})
            } else if (Utils.isNotNull(this.possibleMoves.find(possibleMove => ChessUtils.chessSquaresEqual(possibleMove, square)))) {
                const move = {
                    from: this.state.selectedSquare,
                    to: square
                };
                if (ChessUtils.getPieceFromSquare(this.state.selectedSquare, this.props.chessPieces).type === ChessPieceType.PAWN &&
                    (this.props.playerSide === ChessSide.WHITE && square.row === 8 ||
                    this.props.playerSide === ChessSide.BLACK && square.row === 1)) {
                    this.promotionMove = square;
                    this.setState({});
                } else {
                    ApiLichessUtils.makeMove(move);
                    this.setState({selectedSquare: null});
                }
            }
        } else if (ChessUtils.squareOnSidePiece(square, this.props.chessPieces, this.props.playerSide)) {
            this.setState({selectedSquare: square})
        }
    }

    rednderChessBoard(): JSX.Element[] {
        const chessRows: JSX.Element[] = [];
        if (Utils.isArrayNotEmpty(this.props.chessPieces)) {
            for (let row = 1; row <= 8; row++) {
                chessRows.push(this.renderChessRow(row));
            }
        }
        return chessRows;
    }

    renderChessRow(row: number): JSX.Element {
        let chessRow: JSX.Element[] = [];
        for (let col = 1; col <= 8; col++) {
            chessRow.push(<ChessBoardSquare selectedSquare={this.state.selectedSquare}
                                            onClick={this.clickSquare.bind(this)}
                                            chessSquare={{row, col}}
                                            possibleMoves={this.possibleMoves} />);
        }
        return <div className={`chess-row`}>
            {chessRow}
        </div>
    }

    render(){
        return (
            <div className={`chess-board-wrapper ${this.props.playerSide.toLowerCase()}-player-view`}>
                {Utils.isNotNull(this.promotionMove) &&
                    <ChessPromotionPopup playerSide={this.props.playerSide}
                                         potentialMove={{from: this.state.selectedSquare, to: this.promotionMove}}
                                         onPromotionComplete={() => {
                                             this.promotionMove = null;
                                             this.setState({selectedSquare: null});
                                         }} />
                }
                {(!this.props.chessGameId || this.props.gameEnded) &&
                    <ChessGameConfigurator />}

                {this.props.chessGameId && !this.props.gameEnded && <>
                    <ChessPlayers />
                    {this.rednderChessBoard()}
                    <ChessBoardLetters />
                </>}
            </div>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { gameId, playerSide, chessMoves, gameEnded } = state.chessReducer;
        const { chessPieces, castleInfo } = state.chessBoardReducer;
        return {
            ...ownProps,
            chessGameId: gameId,
            playerSide,
            chessMoves,
            gameEnded,
            chessPieces,
            castleInfo
        }
    })(ChessBoard);
