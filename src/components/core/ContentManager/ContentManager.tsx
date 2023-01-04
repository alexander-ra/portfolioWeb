import React, {Suspense} from 'react';
import {connect} from "react-redux";
import {Page} from '../../../models/common/Page';
import "./ContentManager.scss";
import store from "../../../reducers/store";
import {ThemeType} from '../../../models/common/ThemeType';
import {LayoutType} from "../../../models/common/LayoutType";
import Utils from "../../../utils/Utils";
import {changePage} from "../../../reducers/stages/stagesAction";
import {WindowUtils} from "../../../utils/WindowUtils";
import {setLayoutType} from '../../../reducers/window/windowAction';
import {openCube} from "../../../reducers/cube/cubeAction";

const ContentPage = React.lazy(() => import('../../contentPage/ContentPage')); // Lazy-loaded
const ChessPage = React.lazy(() => import('../../chess/ChessPage')); // Lazy-loaded
const LandingPage = React.lazy(() => import('../../landing/LandingPage')); // Lazy-loaded

interface ContentManagerProps {
    theme: ThemeType;
    layoutType: LayoutType;
    currentPage: Page;
    windowSize: {width: number, height: number};
}

/**
 * ContentManager component. This component is responsible for displaying a given a selected menu item.
 */
class ContentManager extends React.Component<ContentManagerProps> {
    private readonly resizeListener = (event) => {
        WindowUtils.updateWindowClasses(event.target);
    };
    private mainContentRef: React.RefObject<HTMLDivElement>;

    constructor(props: ContentManagerProps) {
        super(props);
        this.mainContentRef = React.createRef();
        const page: Page = WindowUtils.getPageFromURL();
        if (page === Page.LANDING) {
            // window.history.pushState(null, null, "/landing");
        } else {
            store.dispatch(changePage(page));

            if (!store.getState().cubesReducer.cubeOpened) {
                store.dispatch(openCube());
            }
        }
        this.state = {
            actualPage: Page.LANDING,
        }
    }

    componentDidMount() {
        WindowUtils.updateWindowClasses(window);
        WindowUtils.setTheme(this.props.theme);
        window.addEventListener('resize', this.resizeListener);

        window.addEventListener('hashchange', function () {
            store.dispatch(changePage(WindowUtils.getPageFromURL()));
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }

    componentDidUpdate(prevProps: Readonly<ContentManagerProps>) {
        if (prevProps.theme !== this.props.theme) {
            WindowUtils.setTheme(this.props.theme);
        }
        if (prevProps.layoutType !== this.props.layoutType) {
            WindowUtils.setLayoutType(this.props.layoutType);
            WindowUtils.updateWindowClasses(window);
        }
        if (prevProps.windowSize.width !== this.props.windowSize.width && Utils.isNotNull(this.mainContentRef)) {
            const currElement = this.mainContentRef.current;
            if (Utils.isNotNull(currElement?.getBoundingClientRect()) && currElement.getBoundingClientRect().width > window.innerWidth) {
                store.dispatch(setLayoutType(LayoutType.NATIVE));
            }
        }
    }

    render(){
        return (<div className={"main-content-wrapper"} ref={this.mainContentRef}>
            {
                this.props.currentPage === Page.LANDING &&
                <Suspense>
                    <LandingPage />
                </Suspense>
            }
            {
                this.props.currentPage === Page.CLIENT_APPROACH &&
                <Suspense>
                    <ContentPage />
                </Suspense>
            }
            {
                this.props.currentPage === Page.PAST_EXPERIENCE &&
                <Suspense>
                    <ContentPage />
                </Suspense>
            }
            {
                this.props.currentPage === Page.CHESS_DEMO &&
                <Suspense>
                    <ChessPage />
                </Suspense>
            }
        </div>)
    }
}

export default connect((state: any, ownProps) => {
    const { currentPage } = state.stagesReducer;
    const { theme, layoutType, windowSize } = state.windowReducer;
    return {
        ...ownProps,
        currentPage,
        theme,
        layoutType,
        windowSize
    }
}, null)(ContentManager);

