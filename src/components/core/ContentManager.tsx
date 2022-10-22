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

interface ContentManagerProps {
    pageToChange?: Page
}

interface ContentManagerState {
    actualPage?: Page;
    closingPage?: Page;
}


class ContentManager extends React.Component<ContentManagerProps, ContentManagerState> {
    private readonly PAGE_CLOSING_TIME_MS = 1500;
    private readonly NEW_PAGE_DELAY_MS = 1000;
    constructor(props: ContentManagerProps) {
        super(props);
        this.state = {
            actualPage: Page.LANDING,
        }
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
        return (<>
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
        </>)
    }
}

export default connect((state: any, ownProps) => {
    const { currentPage } = state.stagesReducer;
    return {
        ...ownProps,
        pageToChange: currentPage
    }
}, null)(ContentManager);

