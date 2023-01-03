import React from 'react';
import './CubeCover.scss';

/**
 * CubeCover component. This component is responsible for displaying the cover of the cube on site load.
 *
 * @author Alexander Andreev
 */
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
