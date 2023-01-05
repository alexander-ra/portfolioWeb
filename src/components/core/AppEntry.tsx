import React, {CSSProperties, Suspense} from 'react';
import BrowserUtils from '../../utils/BrowserUtils';
const AppDecorator = React.lazy(() => import('./../../components/core/AppDecorator')); // Lazy-loaded
const ContentManager = React.lazy(() => import('./ContentManager/ContentManager')); // Lazy-loaded
const Header = React.lazy(() => import('../layout/Navigation/Header')); // Lazy-loaded

export interface AppEntryProps {
}

export interface AppEntryState {
    parentWrapperStyle: CSSProperties;
}

class AppEntry extends React.Component<AppEntryProps, AppEntryState> {

    constructor(props: AppEntryProps) {
        super(props);

        this.state = {parentWrapperStyle: null};
    }

    componentDidMount() {
        if (BrowserUtils.isMobile()) {
            this.setState({parentWrapperStyle: this.parentWrapperStyle()});

            window.addEventListener('resize', () => {
                this.setState({
                    parentWrapperStyle: this.parentWrapperStyle()
                })
            });
        } else {
            this.state = {parentWrapperStyle: null};
        }
    }

    private parentWrapperStyle = (): any => {
        return {
            width: `100%`,
            height: `100%`,
            position: `fixed`,
            overflow: `hidden`,
            top: `0`,
        }
    }

    render() {
        return <>
                <div className={"device-frame"}></div>
                <div className={"parent-wrapper"} style={this.state.parentWrapperStyle}>
                    <AppDecorator />
                    <div className={"app-wrapper"} id="app">
                        <Suspense>
                            <Header />
                        </Suspense>
                        <Suspense>
                            <ContentManager />
                        </Suspense>
                    </div>
                </div>
            </>
    }
}

export default AppEntry;
