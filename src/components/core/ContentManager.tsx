import React from 'react';
import {connect} from "react-redux";
import {Page} from '../../models/common/Page';
import {openCube, selectMenu} from "../../reducers/cube/cubeAction";
import LandingPage from "../landing/LandingPage";
import ContentPage from "../contentPage/ContentPage";

interface ContentManagerProps {
    pageToChange?: Page
}

interface ContentManagerState {
    actualPage?: Page;
    closingPage?: Page;
}


class ContentManager extends React.Component<ContentManagerProps, ContentManagerState> {
    private readonly PAGE_CLOSING_TIME_MS = 2000;
    private readonly NEW_PAGE_DELAY_MS = 1000;
    constructor(props: ContentManagerProps) {
        super(props);
        this.state = {
            actualPage: Page.PAST_EXPERIENCE,
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

    displayPage(page: Page) : boolean {
        return this.state.actualPage === page || this.state.closingPage === page;
    }

    render(){
        return (<>
            {this.displayPage(Page.LANDING) && <LandingPage isClosing={this.state.closingPage === Page.LANDING} />}
            {this.displayPage(Page.CLIENT_APPROACH) && <ContentPage isClosing={this.state.closingPage === Page.CLIENT_APPROACH} />}
            {this.displayPage(Page.PAST_EXPERIENCE) && <ContentPage isClosing={this.state.closingPage === Page.PAST_EXPERIENCE} />}
            {this.displayPage(Page.CHESS_DEMO) && <LandingPage isClosing={this.state.closingPage === Page.CHESS_DEMO} />}
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

