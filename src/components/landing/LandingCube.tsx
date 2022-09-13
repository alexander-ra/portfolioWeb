import React from 'react';
import './LandingCube.scss';

interface LandingCubeProps {
}

interface LandingCubeState {
    coveredCubeVisible?: boolean;
    cubeOpened?: boolean;
}

class LandingCube extends React.Component<LandingCubeProps, LandingCubeState> {
    private CUBE_OPEN_TIME_MS = 20000;
    constructor(props: LandingCubeProps) {
        super(props);

        this.state = {
            cubeOpened: false,
            coveredCubeVisible: true
        };
    }

    openFlower(): void {
        this.setState({
            cubeOpened: true
        })
        setTimeout(() =>
            this.setState({
                coveredCubeVisible: false
            })
            , this.CUBE_OPEN_TIME_MS);
    }


    render(){
        return (<>
            <div className="loading-element-wrapper">
                    <div className={`flower-wrapper ${this.state.cubeOpened ? "opened" : ""}`}>
                        <div className={"flower"}></div>
                    </div>
                    {!this.state.cubeOpened && <div className={"title-text"}>
                        ENTER
                    </div>}
                    <div className={"cube-core"}></div>
                    <div className={`cube-wrapper  ${this.state.cubeOpened ? "opened" : ""}`} onClick={this.openFlower.bind(this)}>
                        {this.state.coveredCubeVisible && <>
                            <div  className={"wall-initial wall-bottom-initial"}>
                                <div className={"wall-inside-wrapper"}>
                                    <div className={"wall-inside"}>
                                    </div>
                                    <div className={"wall-inside-under-wrapper"}>
                                        <div className={"wall-inside-under"}>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"wall-initial wall-left-initial"}>
                                <div className={"wall-inside-wrapper"}>
                                    <div className={"wall-inside"}>
                                    </div>
                                    <div className={"wall-inside-under-wrapper"}>
                                        <div className={"wall-inside-under"}>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"wall-initial wall-right-initial"}>
                                <div className={"wall-inside-wrapper"}>
                                    <div className={"wall-inside"}>
                                    </div>
                                    <div className={"wall-inside-under-wrapper"}>
                                        <div className={"wall-inside-under"}>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>}
                        <>
                            <div className={"wall wall-bottom"}>
                                <div className={"wall-content"}>
                                    <div className={"wall-icon"}></div>
                                </div>
                                <div className={"wall-label"}>
                                    Past Experience
                                </div>
                            </div>
                            <div className={"wall wall-left"}>
                                <div className={"wall-content"}>
                                    <div className={"wall-icon"}></div>
                                </div>
                                <div className={"wall-label"}>
                                    Client Approach
                                </div>
                            </div>
                            <div className={"wall wall-right"}>
                                <div className={"wall-content"}>
                                    <div className={"wall-icon"}></div>
                                </div>
                                <div className={"wall-label"}>
                                    Play Chess Demo
                                </div>
                            </div>
                        </>
                    </div>
                </div>
                {/*<div className={"page-turner"}>*/}
                {/*    <div className="page-flip">*/}
                {/*        <div className="r1">*/}
                {/*            <div className="p1">*/}
                {/*                <div>*/}
                {/*                    1*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <div className="p2">*/}
                {/*            <div>2</div>*/}
                {/*        </div>*/}
                {/*        <div className="r3">*/}
                {/*            <div className="p3">*/}
                {/*                <div>*/}
                {/*                    3*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
        </>
        )
    }
}

export default LandingCube;
