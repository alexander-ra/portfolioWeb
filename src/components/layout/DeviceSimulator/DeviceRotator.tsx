import React from 'react';
import './DeviceRotator.scss';
import store from "../../../reducers/store";
import {setLayoutType} from '../../../reducers/window/windowAction';
import {LayoutType} from "../../../models/common/LayoutType";
import {connect} from "react-redux";
import Icon from '../../common/Icon/Icon';
import { IconType } from '../../../models/common/IconType';

interface DeviceRotatorProps {
    layoutType: LayoutType;
}

/**
 * DeviceRotator component. This component is responsible for rotating the simulated device.
 *
 * @author Alexander Andreev
 */
class DeviceRotator extends React.Component<DeviceRotatorProps> {

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
            <Icon className={"rotation-Icon"} icon={IconType.faRotateLeft} />
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
