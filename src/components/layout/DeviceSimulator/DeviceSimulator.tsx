import React from 'react';
import './DeviceSimulator.scss';
import store from "../../../reducers/store";
import {setLayoutType} from '../../../reducers/window/windowAction';
import {LayoutType} from "../../../models/common/LayoutType";
import {connect} from "react-redux";
import DeviceRotator from "./DeviceRotator";
import BrowserUtils from "../../../utils/BrowserUtils";
import {ProvisionUtils} from "../../../utils/ProvisionUtils";
import {ResourcePack} from "../../../models/common/ResourcePack";
import {addLoadedResourcePack} from "../../../reducers/stages/stagesAction";

interface DeviceSimulatorProps {
    layoutType: LayoutType;
    hasLoaded: boolean;
    addLoadedResourcePack: (resourcePack: ResourcePack) => void;
}

interface DeviceSimulatorState {
    isLoading: boolean;
}

/**
 * DeviceSimulator component. This component is responsible for simulating a device. Is used for easier previewing of
 * the application.
 *
 * @author Alexander Andreev
 */
class DeviceSimulator extends React.Component<DeviceSimulatorProps, DeviceSimulatorState> {

    constructor(props: DeviceSimulatorProps) {
        super(props);

        this.state = {
            isLoading: !this.props.hasLoaded
        }
    }

    componentDidMount() {
        if (!this.props.hasLoaded) {
            BrowserUtils.loadResources(ProvisionUtils.deviceSimulatorResources())
                .then(() => {
                    this.setState({isLoading: false});
                    this.props.addLoadedResourcePack(ResourcePack.DEVICE_SIM);
                })
                .catch(() => {
                    console.warn('Error loading resources');
                });
        }
    }

    setStateOfSimulation(layoutType: LayoutType): void {
        store.dispatch(setLayoutType(layoutType));
    }

    render(){
        return ( <>
            <DeviceRotator />
            { !this.state.isLoading &&
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
            }
        </>
        )
    }
}

export default connect(
    (state: any, ownProps) => {
        const { layoutType } = state.windowReducer;
        const { resourcesLoaded } = state.stagesReducer;
        return {
            layoutType,
            hasLoaded: resourcesLoaded.indexOf(ResourcePack.DEVICE_SIM) !== -1
        }
    }, { addLoadedResourcePack }
)(DeviceSimulator);
