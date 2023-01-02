import React from 'react';
import '../Navigation/Header.scss';

interface DevicesProps {
}

interface DevicesState {
}

class Devices extends React.Component<DevicesProps, DevicesState> {


    render(){
        return (
        <div className={`devices-wrapper`}>
            <div className={"debice-wrapper"}>
                <div className={`device desktop`}></div>
            </div>
            <div className={"debice-wrapper"}>
                <div className={`device tablet`}></div>
            </div>
            <div className={"debice-wrapper"}>
                <div className={`device smartphone`}></div>
            </div>
        </div>
        )
    }
}

export default Devices;
