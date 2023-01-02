import React from 'react';
import {connect} from 'react-redux';
import './ChessBoard.scss';
import Utils from '../../../utils/Utils';
import {ApiLichessUtils} from "../../../utils/ApiLichessUtils";
import StorageUtil, {StorageKey} from "../../../utils/StorageUtil";
import ChessGameConfigurator from "../ChessConfigurator/ChessGameConfigurator";
import ChessBoardLetters from "./ChessBoardLetters/ChessBoardLetters";
import ChessPromotionPopup from "./ChessPromotionPopup/ChessPromotionPopup";
import ChessPlayers from "./ChessBoardPlayers/ChessBoardPlayers";
import ChessBoardSquare from "./ChessBoardSquare/ChessBoardSquare";
import { ChessSide } from '../../../models/chess/ChessSide';
import { ChessMove } from '../../../models/chess/ChessMove';
import { ChessPiece } from '../../../models/chess/ChessPiece';
import { ChessCastleInfo } from '../../../models/chess/ChessCastleInfo';
import { ChessSquare } from '../../../models/chess/ChessSquare';
import { ChessUtils } from '../../../utils/ChessUtils';
import { ChessPieceType } from '../../../models/chess/ChessPieceType';
import {ChessGameStatus} from "../../../models/chess/ChessGameStatus";
import ChessBoardEndgameMessage from './ChessBoardEndgameMessage/ChessBoardEndgameMessage';

interface ChessBoardProps {
    chessGameId: number;
    playerSide: ChessSide;
    chessMoves: ChessMove[];
    gameStatus: ChessGameStatus;
    chessPieces: ChessPiece[];
    castleInfo: ChessCastleInfo;
    sideInTurn: ChessSide;
}

interface ChessBoardState {
    selectedSquare: ChessSquare;
    gameInProgress: boolean;
}

class ChessBoard extends React.Component<ChessBoardProps, ChessBoardState> {
    private possibleMoves: ChessSquare[] = [];
    private promotionMove: ChessSquare;
    private enPassantSquare: ChessSquare;
    private gameInitialized: boolean = false;
    private processingMoves: boolean = false;

    constructor(props: ChessBoardProps) {
        super(props);
        this.state = {
            selectedSquare: null,
            gameInProgress: false
        };
    }

    componentDidMount() {
        if (Utils.isNull(this.props.chessGameId)) {
            const savedGameId = StorageUtil.getStorage(StorageKey.CHESS_GAME_ID);
            console.log("save", savedGameId);
            if (Utils.isNotNull(savedGameId)) {
                ApiLichessUtils.getUpdatesForGame(savedGameId);
                this.setState({gameInProgress: true});
            }
        } else {
            console.log("save", this.props.chessGameId);
            ApiLichessUtils.getUpdatesForGame(this.props.chessGameId);
            this.setState({gameInProgress: true});
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
        if (prevProps.chessGameId !== this.props.chessGameId) {
            console.warn('Game id changed', this.props.chessGameId);
            this.setState({gameInProgress: Utils.isNotNull(this.props.chessGameId)});
        }

        if (!this.gameInitialized && Utils.isArrayNotEmpty(this.props.chessMoves)) {
            this.gameInitialized = true;
            this.setInitialState();
        }
    }

    setInitialState(): void {
        if (this.isGameFinished()) {
            console.log("finished");
            ApiLichessUtils.resignGame();
        }
    }

    clickSquare(square: ChessSquare): void {
        if (this.props.sideInTurn === this.props.playerSide && this.props.gameStatus === ChessGameStatus.IN_PROGRESS) {
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
        } else {
            this.setState({selectedSquare: null});
            console.log('Not your turn', this.props.gameStatus);
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
                                            possibleMoves={this.possibleMoves}
                                            key={`${row}${col}`}/>);
        }
        return <div className={`chess-row`} key={row} id={`chess-row-${row}`}>
            {chessRow}
        </div>
    }

    isGameFinished(): boolean {
        return this.props.gameStatus !== ChessGameStatus.IN_PROGRESS && this.props.gameStatus !== ChessGameStatus.NOT_STARTED;
    }

    render(){
        return (
            <div className={`chess-board-wrapper ${this.props.playerSide.toLowerCase()}-player-view`}>
                <div className={"bg"}></div>
                {Utils.isNotNull(this.promotionMove) &&
                    <ChessPromotionPopup playerSide={this.props.playerSide}
                                         potentialMove={{from: this.state.selectedSquare, to: this.promotionMove}}
                                         onPromotionComplete={() => {
                                             this.promotionMove = null;
                                             this.setState({selectedSquare: null});
                                         }} />
                }
                {!this.state.gameInProgress && <ChessGameConfigurator />}

                {this.state.gameInProgress && <>
                    <ChessPlayers />
                    {this.rednderChessBoard()}
                    <ChessBoardLetters />
                    { this.isGameFinished() && <ChessBoardEndgameMessage gameStatus={this.props.gameStatus} />}
                </>}
            </div>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { gameId, playerSide, chessMoves, gameStatus } = state.chessReducer;
        const { chessPieces, castleInfo, sideInTurn } = state.chessBoardReducer;
        return {
            ...ownProps,
            chessGameId: gameId,
            playerSide,
            chessMoves,
            gameStatus,
            chessPieces,
            castleInfo,
            sideInTurn
        }
    })(ChessBoard);
