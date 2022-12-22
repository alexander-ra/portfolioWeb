import React from 'react';
import './NavigationSubMenu.scss';
import Icon from '../common/icon/Icon';
import {IconType} from '../common/icon/IconType';
import {connect} from "react-redux";
import {changePage} from "../../reducers/stages/stagesAction";
import {Page} from '../../models/common/Page';

interface ExpandedMenuProps {
    changePage?: any;
    currentPage?: Page;
}

interface ExpandedMenuState {
    shouldDisplayMenu: boolean;
}

class NavigationSubMenu extends React.Component<ExpandedMenuProps, ExpandedMenuState> {
    constructor(props: ExpandedMenuProps) {
        super(props);

        this.state = {
            shouldDisplayMenu: true
        }
    }

    private changePage = (page: Page) => {
        if (this.props.currentPage !== page) {
            this.setState({shouldDisplayMenu: false});
            setTimeout(() => {
                this.setState({shouldDisplayMenu: true});
            }, 100);
            this.props.changePage(page);
        }
    }

    render(){
        return (<>{ this.state.shouldDisplayMenu &&
                <div className={"navigation-expanded-menu expanded-menu"}>
                    <div className={`expanded-menu-item ${this.props.currentPage === Page.LANDING ? "selected-menu" : ""}`}
                         onClick={() => this.changePage(Page.LANDING)}>
                        <Icon className={"expanded-menu-icon"} icon={IconType.faCube} />
                        <div className={`expanded-menu-label`}>Home</div>
                    </div>
                    <div className={`expanded-menu-item ${this.props.currentPage === Page.CLIENT_APPROACH ? "selected-menu" : ""}`}
                         onClick={() => this.changePage(Page.CLIENT_APPROACH)}>
                        <Icon className={"expanded-menu-icon"} icon={IconType.faHandshake} />
                        <div className={`expanded-menu-label`}>Client Approach</div>
                    </div>
                    <div className={`expanded-menu-item ${this.props.currentPage === Page.PAST_EXPERIENCE ? "selected-menu" : ""}`}
                         onClick={() => this.changePage(Page.PAST_EXPERIENCE)}>
                        <Icon className={"expanded-menu-icon"} icon={IconType.faSuitcase} />
                        <div className={`expanded-menu-label`}>Past Experience</div>
                    </div>
                    <div className={`expanded-menu-item ${this.props.currentPage === Page.CHESS_DEMO ? "selected-menu" : ""}`}
                         onClick={() => this.changePage(Page.CHESS_DEMO)}>
                        <Icon className={"expanded-menu-icon"} icon={IconType.faChess} />
                        <div className={`expanded-menu-label`}>Chess Demo</div>
                    </div>
                </div>
            }
        </>
        )
    }
}

export default connect((state: any, ownProps) => {
    const { currentPage } = state.stagesReducer;
    return {
        ...ownProps,
        currentPage
    }
}, { changePage })(NavigationSubMenu);