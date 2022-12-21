import React, {Suspense} from 'react';
import {connect} from "react-redux";
import {Page} from '../../models/common/Page';
import "./ContentManager.scss";
import store from "../../store/store";
import {ThemeType} from './ThemeType';
import {LayoutType} from "./LayoutType";
import Utils from "../../utils/Utils";
import {changePage} from "../../reducers/stages/stagesAction";
import {WindowUtils} from "../../utils/WindowUtils";
import { setLayoutType } from '../../reducers/window/windowAction';
const ContentPage = React.lazy(() => import('../contentPage/ContentPage')); // Lazy-loaded
const ChessPage = React.lazy(() => import('../chess/ChessPage')); // Lazy-loaded
const LandingPage = React.lazy(() => import('../landing/LandingPage')); // Lazy-loaded

interface ContentManagerProps {
    pageToChange?: Page;
    theme: ThemeType;
    layoutType: LayoutType;
    windowSize: {width: number, height: number};
}

interface ContentManagerState {
    actualPage?: Page;
    closingPage?: Page;
}


class ContentManager extends React.Component<ContentManagerProps, ContentManagerState> {
    private readonly PAGE_CLOSING_TIME_MS = 0;
    private readonly NEW_PAGE_DELAY_MS = 0;
    private readonly resizeListener = (event) => {
        WindowUtils.updateWindowClasses(event.target);
    };
    private mainContentRef: React.RefObject<HTMLDivElement>;

    constructor(props: ContentManagerProps) {
        super(props);
        this.mainContentRef = React.createRef();
        const page: Page = WindowUtils.getPageFromURL();
        if (page === Page.LANDING) {
            window.history.pushState(null, null, "/landing");
        } else {
            store.dispatch(changePage(page));
        }
        this.state = {
            actualPage: Page.LANDING,
        }
    }

    componentDidMount() {
        WindowUtils.updateWindowClasses(window);
        window.addEventListener('resize', this.resizeListener);

        window.addEventListener('hashchange', function () {
            store.dispatch(changePage(WindowUtils.getPageFromURL()));
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }

    componentDidUpdate(prevProps: Readonly<ContentManagerProps>) {
        if (prevProps.pageToChange !== this.props.pageToChange) {
            this.setState({closingPage: prevProps.pageToChange});
            setTimeout(() => {
                this.setState({closingPage: undefined});
            }, this.PAGE_CLOSING_TIME_MS);
            setTimeout(() => {
                this.setState({actualPage: this.props.pageToChange});
            }, this.NEW_PAGE_DELAY_MS);
        }
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

    displayPage(page: Page): boolean {
        return this.state.actualPage === page || this.state.closingPage === page;
    }

    render(){
        return (<div className={"main-content-wrapper"} ref={this.mainContentRef}>
            {
                this.displayPage(Page.LANDING) &&
                <Suspense>
                    <LandingPage isClosing={this.state.closingPage === Page.LANDING} />
                </Suspense>
            }
            {
                this.displayPage(Page.CLIENT_APPROACH) &&
                <Suspense>
                    <ContentPage isClosing={this.state.closingPage === Page.CLIENT_APPROACH} />
                </Suspense>
            }
            {
                this.displayPage(Page.PAST_EXPERIENCE) &&
                <Suspense>
                    <ContentPage isClosing={this.state.closingPage === Page.PAST_EXPERIENCE} />
                </Suspense>
            }
            {
                this.displayPage(Page.CHESS_DEMO) &&
                <Suspense>
                    <ChessPage isClosing={this.state.closingPage === Page.CHESS_DEMO} />
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
        pageToChange: currentPage,
        theme,
        layoutType,
        windowSize
    }
}, null)(ContentManager);

