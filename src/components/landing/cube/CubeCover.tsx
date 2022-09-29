import React from 'react';
import './CubeCover.scss';

class CubeCover extends React.Component {
    render(){
        return (
            <>
                <div  className={"wall-initial wall-bottom-initial"}>
                    <div className={"wall-inside-wrapper"}>
                        <div className={"wall-inside"}></div>
                        <div className={"wall-inside-under-wrapper"}>
                            <div className={"wall-inside-under"}></div>
                        </div>
                    </div>
                </div>
                <div className={"wall-initial wall-left-initial"}>
                    <div className={"wall-inside-wrapper"}>
                        <div className={"wall-inside"}></div>
                        <div className={"wall-inside-under-wrapper"}>
                            <div className={"wall-inside-under"}></div>
                        </div>
                    </div>
                </div>
                <div className={"wall-initial wall-right-initial"}>
                    <div className={"wall-inside-wrapper"}>
                        <div className={"wall-inside"}></div>
                        <div className={"wall-inside-under-wrapper"}>
                            <div className={"wall-inside-under"}></div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default CubeCover;
