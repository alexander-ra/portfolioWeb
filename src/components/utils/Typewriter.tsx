import React from 'react';
import "./typewriter.scss"

interface TypewriterProps {
}

interface TypewriterState {
    currentLetterNum: number;
}

class Typewriter extends React.Component<TypewriterProps, TypewriterState> {
    private initialDelay = 3000;
    private finalText = "Hi. My name is Alex. I am web developer with a decade of experience in the field. With a focus in the past in front-end banking ang web gaming solutions, I strive to deliver swift web apps with seamless interactiveness and impeccable security."
    private letterDistance = 25;
    private wordDistance = 35;
    private sentenceDistance = 225;

    constructor(props: TypewriterProps) {
        super(props);
        this.state = {currentLetterNum: 0};
        setTimeout(this.typeLetter.bind(this), this.initialDelay);
    }

    typeLetter() {
        const curLength = this.state.currentLetterNum;

        if (curLength <= this.finalText.length) {
            const delay = this.getDelay(this.finalText[this.state.currentLetterNum]);
            setTimeout(() => {
                this.typeLetter();
                this.setState({currentLetterNum: this.state.currentLetterNum + 1});
            }, delay);
        }
    }

    getDelay(letter: string) {
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
        return (<>
                <div className="typewriter-wrapper">
                    <span className="line-1">{this.finalText.slice(0, this.state.currentLetterNum)}</span>
                    <span className="anim-typewriter"></span>
                </div>
            </>
        )
    }
}

export default Typewriter;
