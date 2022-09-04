import React from 'react';
import '../landing/Loader.scss';
import {LoadingStage} from "../../LoadingStage";

interface LoaderProps {
}

interface LoaderState {
    stage: LoadingStage
}

class Loader extends React.Component<LoaderProps, LoaderState> {
    private DUMMY_LOAD_LAPS = 2;
    private LAP_TIME_MS = 1000;
    private STAGE_ONE_TIME_MS = 200;

    constructor(props: LoaderProps){
        super(props);
        this.setState({
            stage: LoadingStage.LOADING
        })
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                stage: LoadingStage.FIRING_FIRST
            })
            setTimeout(() => {
                this.setState({
                    stage: LoadingStage.FIRING_SECOND
                })
                setTimeout(() => {
                    this.setState({
                        stage: LoadingStage.FIRING_THIRD
                    })
                }, this.LAP_TIME_MS * 1.5);
            }, this.LAP_TIME_MS * 1.5);
        }, this.DUMMY_LOAD_LAPS * this.LAP_TIME_MS);
    }

    render(){
        let className = null;
        if (this.state) {
            className = this.state.stage;
        }
        return (
            <div className={`loader ${className}`}>
                <div className="loader-wrap">
                    <div className="shadow"></div>
                    <div className="circles">
                        <div className="circle-1 circle"></div>
                        <div className="circle-1-barrier barrier"></div>
                        <div className="circle-2 circle"></div>
                        <div className="circle-2-barrier barrier"></div>
                        <div className="circle-3 circle"></div>
                        <div className="circle-3-barrier barrier"></div>
                    </div>
                    <div className="bullets">
                        <div className="bullet-1 bullet"></div>
                        <div className="bullet-2 bullet"></div>
                        <div className="bullet-3 bullet"></div>
                    </div>
                    <div className="center-dot circle"></div>
                </div>
            </div>
        )
    }
}

export default Loader;
