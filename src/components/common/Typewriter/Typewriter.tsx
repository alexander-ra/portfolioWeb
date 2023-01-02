import React from 'react';
import "./Typewriter.scss"

interface TypewriterProps {
    textToType: string;
    onCompleted: () => any;
    skipTyping?: boolean;
    boldLettersStart: number;
    boldLettersEnd: number;
}

interface TypewriterState {
    currentLetterNum: number;
    textDone: boolean;
}

class Typewriter extends React.Component<TypewriterProps, TypewriterState> {
    private initialDelay = 3000;
    private textDoneDelay = 1000;
    private letterDistance = 25;
    private wordDistance = 25;
    private sentenceDistance = 400;

    // private STARTING_LETTER_NUM = 243;
    // private END_LETTER_NUM = 279;

    // Speeds up typing on click
    private isSpedUp = false;
    private spedUpMultiplier = 3;

    constructor(props: TypewriterProps) {
        super(props);
        this.state = {currentLetterNum: 0, textDone: false};
    }

    componentDidMount() {
        setTimeout(this.typeLetter.bind(this), this.initialDelay);
    }

    typeLetter() {
        const curLength = this.state.currentLetterNum;

        if (curLength <= this.props.textToType.length && !this.props.skipTyping) {
            const delay = this.getDelay(this.props.textToType[this.state.currentLetterNum]);
            setTimeout(() => {
                this.typeLetter();
                this.setState({currentLetterNum: this.state.currentLetterNum + 1});
            }, delay);
        } else {
            setTimeout(() => {
                this.props.onCompleted();
                this.setState({textDone: true})
            }, this.textDoneDelay);
        }
    }

    getDelay(letter: string) {
        let delay = 0;
        switch(letter) {
            case " ":
                delay = this.wordDistance;
                break;
            case ".":
            case "?":
            case "!":
                delay = this.sentenceDistance;
                break;
            default:
                delay = this.letterDistance;
                break;
        }

        if (this.isSpedUp) {
            return delay / this.spedUpMultiplier;
        } else {
            return delay;
        }
    }

    render(){
        return (
            <div className={`typewriter-wrapper ${this.isSpedUp ? "sped-up" : ""}`} onClick={() => {this.isSpedUp = true;}}>
                {this.props.skipTyping ?
                    <>
                        <span className="typewriter-section">
                            {this.props.textToType.slice(0, this.props.boldLettersStart)}
                        </span>
                        <span className="typewriter-section bold">
                            {this.props.textToType.slice(this.props.boldLettersStart, this.props.boldLettersEnd)}
                        </span>
                        <span className="typewriter-section">
                            {this.props.textToType.slice(this.props.boldLettersEnd)}
                        </span>
                    </>
                    :
                    <>
                        <span className="typewriter-section">
                            {this.props.textToType.slice(0, Math.min(this.state.currentLetterNum, this.props.boldLettersStart))}
                        </span>
                        {this.props.textToType.length > this.props.boldLettersStart &&
                            <span className="typewriter-section bold">
                                {this.props.textToType.slice(this.props.boldLettersStart, Math.min(this.state.currentLetterNum, this.props.boldLettersEnd))}
                            </span>
                        }
                        {this.props.textToType.length > this.props.boldLettersEnd &&
                            <span className="typewriter-section">
                                {this.props.textToType.slice(this.props.boldLettersEnd, this.state.currentLetterNum)}
                            </span>
                        }
                    </>
                }
                {
                    !this.state.textDone && !this.props.skipTyping && <>
                        <span className="anim-typewriter"></span>
                        <span className="typewriter-section transparent">
                            {this.props.textToType.slice(this.state.currentLetterNum, this.props.boldLettersStart)}
                        </span>
                        {this.props.textToType.length > this.props.boldLettersStart &&
                            <span className="typewriter-section transparent bold">
                                {this.props.textToType.slice(Math.max(this.props.boldLettersStart, this.state.currentLetterNum), this.props.boldLettersEnd)}
                            </span>
                        }
                        {this.props.textToType.length > this.props.boldLettersEnd &&
                            <span className="typewriter-section transparent">
                                {this.props.textToType.slice(Math.max(this.props.boldLettersEnd, this.state.currentLetterNum))}
                            </span>
                        }
                    </>
                }
            </div>
        )
    }
}

export default Typewriter;
