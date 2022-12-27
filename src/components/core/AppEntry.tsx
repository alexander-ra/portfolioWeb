import React, {CSSProperties, Suspense} from 'react';
import BrowserUtils from '../../utils/BrowserUtils';
const AppDecorator = React.lazy(() => import('./../../components/core/AppDecorator')); // Lazy-loaded
const ContentManager = React.lazy(() => import('./../../components/core/ContentManager')); // Lazy-loaded
const Header = React.lazy(() => import('./../../components/layout/Header')); // Lazy-loaded

export interface AppEntryProps {
}

export interface AppEntryState {
    parentWrapperStyle: CSSProperties;
}

class AppEntry extends React.Component<AppEntryProps, AppEntryState> {

    constructor(props: AppEntryProps) {
        super(props);

        if (BrowserUtils.isMobile()) {
            this.state = {parentWrapperStyle: this.parentWrapperStyle()};

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
                    <div className={"app-wrapper"}>
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
