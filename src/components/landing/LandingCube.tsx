import React from 'react';
import './LandingCube.scss';

interface LandingCubeProps {
}

interface LandingCubeState {
}

class LandingCube extends React.Component<LandingCubeProps, LandingCubeState> {


    render(){
        return (
        <>
            <div className={"flower"}></div>
            <div className={"enter-text"}>
                Enter
            </div>
            <div className={"cube-wrapper"}>
                <div className={"cube cube-bottom"}></div>
                <div className={"cube cube-left"}></div>
                <div className={"cube cube-right"}></div>
            </div>
        </>
        )
    }
}

export default LandingCube;
