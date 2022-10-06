import React from 'react';
import "./typewriter.scss"

interface TypewriterProps {
    textToType: string;
    onCompleted: () => any;
    skipTyping?: boolean;
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

    // Speeds up typing on click
    private isSpedUp = false;
    private spedUpMultiplier = 3;

    constructor(props: TypewriterProps) {
        super(props);
        this.state = {currentLetterNum: 0, textDone: false};
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

    speedUp(letter: string) {
        switch(letter) {
            case " ":
                return this.wordDistance;
            case ".":
            case "?":
            case "!":
                return this.sentenceDistance;
            default:
                return this.letterDistance;
        }
    }

    render(){
        return (
            <div className="typewriter-wrapper" onClick={() => {this.isSpedUp = true;}}>
                {this.props.skipTyping ?
                    <span className="line-1">{this.props.textToType}</span>
                    :
                    <span className="line-1">{this.props.textToType.slice(0, this.state.currentLetterNum)}</span>
                }
                {
                    !this.state.textDone && !this.props.skipTyping && <>
                        <span className="anim-typewriter"></span>
                        <span className="line-1 transparent">{this.props.textToType.slice(this.state.currentLetterNum)}</span>
                    </>
                }
            </div>
        )
    }
}

export default Typewriter;
