import React, {Suspense} from 'react';
import DeviceRotator from "../layout/DeviceSimulator/DeviceRotator";
import "./AppDecorator.scss";
import DeviceSimulator from "../layout/DeviceSimulator/DeviceSimulator";
import {connect} from "react-redux";
import BrowserUtils from '../../utils/BrowserUtils';

export interface AppDecoratorProps {
    cubeOpened: boolean;
}

/**
 * AppDecorator component. This component is responsible for displaying the background of the application, as well as
 * the frames for the simulated devices.
 *
 * @author Alexander Andreev
 */
class AppDecorator extends React.Component<AppDecoratorProps> {

    render() {
        return <div className={"app-decorator"}>
            <Suspense>
                {this.props.cubeOpened && !BrowserUtils.isMobile() && <>
                    <DeviceSimulator />
                </>}
            </Suspense>
        </div>
    }
}

export default connect(
    (state: any, ownProps) => {
        const { cubeOpened } = state.cubesReducer;
        return {
            cubeOpened
        }
    })(AppDecorator);
