import React, {Suspense} from 'react';
import DeviceRotator from "../layout/DeviceRotator";
import "./AppDecorator.scss";
import DeviceSimulator from "../layout/DeviceSimulator";
import {connect} from "react-redux";
import BrowserUtils from '../../utils/BrowserUtils';

export interface AppDecoratorProps {
    cubeOpened: boolean;
}

class AppDecorator extends React.Component<AppDecoratorProps> {

    render() {
        return <div className={"app-decorator"}>
            <Suspense fallback={<h1>Loading</h1>}>
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
