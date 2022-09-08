import React from 'react';
import './LandingCube.scss';

interface LandingCubeProps {
}

interface LandingCubeState {
    openedFlower: boolean;
}

class LandingCube extends React.Component<LandingCubeProps, LandingCubeState> {

    constructor(props: LandingCubeProps) {
        super(props);

        this.setState({
            openedFlower: false
        })
    }

    openFlower(): void {
        this.setState({
            openedFlower: (this.state && this.state.openedFlower === true) ? false : true
        })
    }


    render(){
        return (
        <>
            <div className={`flower-wrapper ${this.state && this.state.openedFlower ? "opened" : ""}`}>
                <div className={"flower"}></div>
            </div>
            <div className={"enter-text"}>
                Enter
            </div>
            <div className={`cube-wrapper  ${this.state && this.state.openedFlower ? "opened" : ""}`} onClick={this.openFlower.bind(this)}>
                <div className={"cube cube-bottom"}>
                    <div className={"wall-icon"}></div>
                </div>
                <div className={"cube cube-left"}>
                    <div className={"wall-icon"}></div>
                </div>
                <div className={"cube cube-right"}>
                    <div className={"wall-icon"}></div>
                </div>
                <div className={"cube-initial cube-bottom-initial"}></div>
                <div className={"cube-initial cube-left-initial"}></div>
                <div className={"cube-initial cube-right-initial"}></div>
            </div>
            <div className={"cube-core"}>
            </div>
        </>
        )
    }
}

export default LandingCube;
