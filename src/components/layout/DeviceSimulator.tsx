import React from 'react';
import './DeviceSimulator.scss';
import store from "../../store/store";
import {setLayoutType} from '../../reducers/window/windowAction';
import {LayoutType} from "../core/LayoutType";

interface DeviceSimulatorProps {
}

interface DeviceSimulatorState {
}

class DeviceSimulator extends React.Component<DeviceSimulatorProps, DeviceSimulatorState> {

    setStateOfSimulation(layoutType: LayoutType): void {
        store.dispatch(setLayoutType(layoutType));
    }

    render(){
        return (
        <div className={`device-simulator-wrapper`}>
            <div className={"desktop-device device"} onClick={() => {this.setStateOfSimulation(LayoutType.NATIVE)}}/>
            <div className={"mobile-device device"} onClick={() => {this.setStateOfSimulation(LayoutType.MOBILE_PORTRAIT)}}/>
            <div className={"tablet-device device"} onClick={() => {this.setStateOfSimulation(LayoutType.TABLET_LANDSCAPE)}}/>
        </div>
        )
    }
}

export default DeviceSimulator;
