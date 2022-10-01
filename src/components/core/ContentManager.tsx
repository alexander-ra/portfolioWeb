import React from 'react';
import {connect} from "react-redux";
import {Page} from '../../models/common/Page';
import {openCube, selectMenu} from "../../reducers/cube/cubeAction";
import LandingPage from "../landing/LandingPage";

interface ContentManagerProps {
    pageToChange?: Page
}

interface ContentManagerState {
    actualPage?: Page;
    closingPage?: Page;
}


class ContentManager extends React.Component<ContentManagerProps, ContentManagerState> {
    private readonly PAGE_TRANSITION_TIME_MS = 2000;
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
                this.setState({actualPage: this.props.pageToChange});
            }, this.PAGE_TRANSITION_TIME_MS);
        }
    }

    render(){
        return (<>
            {this.state.actualPage === Page.LANDING && <LandingPage isClosing={this.state.closingPage === Page.LANDING} />}
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

