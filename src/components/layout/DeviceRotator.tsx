import React from 'react';
import './DeviceRotator.scss';
import store from "../../store/store";
import {setLayoutType} from '../../reducers/window/windowAction';
import {LayoutType} from "../core/LayoutType";
import {connect} from "react-redux";
import Icon from '../common/icon/Icon';
import { IconType } from '../common/icon/IconType';

interface DeviceRotatorProps {
    layoutType: LayoutType;
}

interface DeviceRotatorState {
}

class DeviceRotator extends React.Component<DeviceRotatorProps, DeviceRotatorState> {

    setStateOfSimulation(): void {
        switch (this.props.layoutType) {
            case LayoutType.NATIVE:
                return;
            case LayoutType.MOBILE_PORTRAIT:
                store.dispatch(setLayoutType(LayoutType.MOBILE_LANDSCAPE));
                break;
            case LayoutType.MOBILE_LANDSCAPE:
                store.dispatch(setLayoutType(LayoutType.MOBILE_PORTRAIT));
                break;
            case LayoutType.TABLET_LANDSCAPE:
                store.dispatch(setLayoutType(LayoutType.TABLET_PORTRAIT));
                break;
            case LayoutType.TABLET_PORTRAIT:
                store.dispatch(setLayoutType(LayoutType.TABLET_LANDSCAPE));
                break;
            default:
                return;
        }
    };

    render(){
        return ( this.props.layoutType !== LayoutType.NATIVE &&
        <div className={`device-rotator-wrapper`} onClick={() => this.setStateOfSimulation()}>
            <Icon className={"rotation-icon"} icon={IconType.faRotateLeft} />
        </div>
        )
    }
}

export default connect((state: any, ownProps) => {
    const { layoutType } = state.windowReducer;
    return {
        layoutType
    }
}, null)(DeviceRotator);
