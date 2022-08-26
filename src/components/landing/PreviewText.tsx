import React from 'react';
import '../landing/Loader.scss';
import {LoadingStage} from "../../LoadingStage";

interface PreviewTextProps {
}

interface PreviewTextState {
    stage: LoadingStage
}

class PreviewText extends React.Component<PreviewTextProps, PreviewTextState> {

    constructor(props: PreviewTextProps){
        super(props);
        this.setState({
            stage: LoadingStage.LOADING
        })
    }

    componentDidMount() {

    }

    render(){
        return (
            <div className="title">
              <span className="text write" data-splitting="lines">
                RETRO<br/>
                LASER<br/>
                WRITE
              </span>
                <span aria-hidden="true" className="text laser" data-splitting="lines">
                RETRO<br/>
                LASER<br/>
                WRITE
              </span>
            </div>
        )
    }
}

export default PreviewText;
