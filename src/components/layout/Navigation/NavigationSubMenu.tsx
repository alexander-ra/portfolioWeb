import React from 'react';
import './NavigationSubMenu.scss';
import Icon from '../../common/Icon/Icon';
import {IconType} from '../../../models/common/IconType';
import {connect} from "react-redux";
import {changePage} from "../../../reducers/stages/stagesAction";
import {Page} from '../../../models/common/Page';
import { CommonLabels } from '../../../provision/CommonLabels';

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
                        <div className={`expanded-menu-label`}>{CommonLabels.HOME}</div>
                    </div>
                    <div className={`expanded-menu-item ${this.props.currentPage === Page.CLIENT_APPROACH ? "selected-menu" : ""}`}
                         onClick={() => this.changePage(Page.CLIENT_APPROACH)}>
                        <Icon className={"expanded-menu-icon"} icon={IconType.faHandshake} />
                        <div className={`expanded-menu-label`}>{CommonLabels.CLIENT_APPROACH}</div>
                    </div>
                    <div className={`expanded-menu-item ${this.props.currentPage === Page.PAST_EXPERIENCE ? "selected-menu" : ""}`}
                         onClick={() => this.changePage(Page.PAST_EXPERIENCE)}>
                        <Icon className={"expanded-menu-icon"} icon={IconType.faSuitcase} />
                        <div className={`expanded-menu-label`}>{CommonLabels.PAST_EXPERIENCE}</div>
                    </div>
                    <div className={`expanded-menu-item ${this.props.currentPage === Page.CHESS_DEMO ? "selected-menu" : ""}`}
                         onClick={() => this.changePage(Page.CHESS_DEMO)}>
                        <Icon className={"expanded-menu-icon"} icon={IconType.faChess} />
                        <div className={`expanded-menu-label`}>{CommonLabels.CHESS_DEMO}</div>
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