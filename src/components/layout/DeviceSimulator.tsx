import React from 'react';
import './DeviceSimulator.scss';
import store from "../../store/store";
import {setLayoutType} from '../../reducers/window/windowAction';
import {LayoutType} from "../core/LayoutType";
import {connect} from "react-redux";
import DeviceRotator from "./DeviceRotator";

interface DeviceSimulatorProps {
    layoutType: LayoutType;
}

interface DeviceSimulatorState {
}

class DeviceSimulator extends React.Component<DeviceSimulatorProps, DeviceSimulatorState> {

    setStateOfSimulation(layoutType: LayoutType): void {
        store.dispatch(setLayoutType(layoutType));
    }

    render(){
        return ( <>
            <DeviceRotator />
            <div className={`device-simulator-wrapper`}>
                <div className={`desktop-device device ${this.props.layoutType === LayoutType.NATIVE ? "selected" : ""}`}
                     onClick={() => {this.setStateOfSimulation(LayoutType.NATIVE)}}/>
                <div className={`mobile-device device ${this.props.layoutType === LayoutType.MOBILE_PORTRAIT ||
                this.props.layoutType === LayoutType.MOBILE_LANDSCAPE ?
                    "selected" : ""}`} onClick={() => {this.setStateOfSimulation(LayoutType.MOBILE_PORTRAIT)}}/>
                <div className={`tablet-device device ${this.props.layoutType === LayoutType.TABLET_PORTRAIT ||
                this.props.layoutType === LayoutType.TABLET_LANDSCAPE ?
                    "selected" : ""}`} onClick={() => {this.setStateOfSimulation(LayoutType.TABLET_LANDSCAPE)}}/>
            </div>
        </>
        )
    }
}

export default connect(
    (state: any, ownProps) => {
        const { layoutType } = state.windowReducer;
        return {
            layoutType
        }
    }
)(DeviceSimulator);
