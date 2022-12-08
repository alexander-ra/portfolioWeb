import React from 'react';
import {connect} from "react-redux";
import {Page} from '../../models/common/Page';
import LandingPage from "../landing/LandingPage";
import ContentPage, {Section} from "../contentPage/ContentPage";
import {CircleMenuStates} from "../../models/landing/CircleMenuStates";
import {
    faBusinessTime,
    faFileCode,
    faGauge,
    faHome,
    faKey,
    faMoneyBillTrendUp,
    faUserTie
} from '@fortawesome/free-solid-svg-icons';
import {faAccessibleIcon} from "@fortawesome/free-brands-svg-icons";
import ChessPage from '../chess/ChessPage';
import BrowserUtils from '../../utils/BrowserUtils';
import { UIOrientation } from './UIOrientation';
import "./ContentManager.scss";
import store from "../../store/store";
import {setWindowSize} from "../../reducers/window/windowAction";
import { ThemeType } from './ThemeType';

interface ContentManagerProps {
    pageToChange?: Page;
    theme: ThemeType;
}

interface ContentManagerState {
    actualPage?: Page;
    closingPage?: Page;
}


class ContentManager extends React.Component<ContentManagerProps, ContentManagerState> {
    private readonly PAGE_CLOSING_TIME_MS = 0;
    private readonly NEW_PAGE_DELAY_MS = 0;
    private readonly resizeListener = (event) => {
        this.updateWindowClasses(event.target);
    };
    private readonly addToClassList = (classToAdd: string) => document.body.classList.add(classToAdd);
    private readonly removeFromClassList = (classToRemove: string) => document.body.classList.remove(classToRemove);

    constructor(props: ContentManagerProps) {
        super(props);
        this.state = {
            actualPage: Page.LANDING,
        }
    }

    componentDidMount() {
        this.updateWindowClasses(window);
        window.addEventListener('resize', this.resizeListener);
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
            if (this.props.theme === ThemeType.LIGHT) {
                this.addToClassList('light-theme');
                this.removeFromClassList('dark-theme');
            } else {
                this.addToClassList('dark-theme');
                this.removeFromClassList('light-theme');
            }
        }
    }

    updateWindowClasses(element: Window): void {
        store.dispatch(setWindowSize(element.innerWidth, element.innerHeight));
        const uiOrientation = BrowserUtils.getOrientation();

        if (uiOrientation === UIOrientation.LANDSCAPE) {
            this.addToClassList("vw-landscape");
            this.removeFromClassList("vw-portrait");
        } else {
            this.addToClassList("vw-portrait");
            this.removeFromClassList("vw-landscape");

        }
        if (BrowserUtils.isBigScreen()) {
            this.addToClassList("vw-big-screen");
        } else {
            this.removeFromClassList("vw-big-screen");
        }

        if (!BrowserUtils.isTouchable()) {
            this.addToClassList("vw-no-touch");
        }

        if (BrowserUtils.isIE()) {
            this.addToClassList("vw-ie");
        }

        if (BrowserUtils.isMobile()) {
            this.addToClassList("vw-mobile");
            document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
        }


        if (BrowserUtils.isIPhone5()) {
            this.addToClassList("dev-iphone5");
        }
        if (BrowserUtils.isIOS()) {
            this.addToClassList("dev-ios");
        }

        if (BrowserUtils.isIPhone6_8()) {
            this.addToClassList("dev-iphone6-8");
        }

        if (BrowserUtils.isIPhoneX()) {
            this.addToClassList("dev-iphoneX");
        }
    }

    displayPage(page: Page): boolean {
        return this.state.actualPage === page || this.state.closingPage === page;
    }

    getClinetApproachSections(): Section[] {
        return [
            {
                icon: faHome,
                menu: CircleMenuStates.APPROACH_HOME
            },
            {
                icon: faBusinessTime,
                menu: CircleMenuStates.BUSINESS
            },
            {
                icon: faKey,
                menu: CircleMenuStates.SECURITY
            },
            {
                icon: faGauge,
                menu: CircleMenuStates.SWIFTNESS
            },
            {
                icon: faAccessibleIcon,
                menu: CircleMenuStates.ACCESSIBILITY
            }
        ];
    }

    getPastExperienceSections(): Section[] {
        return [
            {
                icon: faHome,
                menu: CircleMenuStates.EXPERIENCE_HOME
            },
            {
                icon: faUserTie,
                menu: CircleMenuStates.POSITION
            },
            {
                icon: faMoneyBillTrendUp,
                menu: CircleMenuStates.FIELD
            },
            {
                icon: faFileCode,
                menu: CircleMenuStates.FRAMEWORK
            }
        ];
    }

    render(){
        return (<div className={"main-content-wrapper"}>
            {
                this.displayPage(Page.LANDING) &&
                <LandingPage isClosing={this.state.closingPage === Page.LANDING} />
            }
            {
                this.displayPage(Page.CLIENT_APPROACH) &&
                <ContentPage sections={this.getClinetApproachSections()}
                             isClosing={this.state.closingPage === Page.CLIENT_APPROACH} />
            }
            {
                this.displayPage(Page.PAST_EXPERIENCE) &&
                <ContentPage sections={this.getPastExperienceSections()}
                             isClosing={this.state.closingPage === Page.PAST_EXPERIENCE} />
            }
            {
                this.displayPage(Page.CHESS_DEMO) &&
                <ChessPage isClosing={this.state.closingPage === Page.CHESS_DEMO} />
            }
        </div>)
    }
}

export default connect((state: any, ownProps) => {
    const { currentPage } = state.stagesReducer;
    const { theme } = state.windowReducer;
    return {
        ...ownProps,
        pageToChange: currentPage,
        theme
    }
}, null)(ContentManager);

