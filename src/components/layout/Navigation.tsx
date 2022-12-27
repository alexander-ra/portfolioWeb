import React from 'react';
import './Navigation.scss';
import store from "../../store/store";
import {setTheme} from '../../reducers/window/windowAction';
import {ThemeType} from "../core/ThemeType";
import {connect} from "react-redux";
import NavigationSubMenu from "./NavigationSubMenu";
import ContactsSubMenu from "./ContactsSubMenu";
import Icon from "../common/icon/Icon";
import {IconType} from "../common/icon/IconType";
import {ProvisionUtils} from "../../utils/ProvisionUtils";
import BrowserUtils from "../../utils/BrowserUtils";

interface NavigationProps {
    theme: ThemeType;
}

interface NavigationState {
    isLoading: boolean;
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
    constructor(props: NavigationProps) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        BrowserUtils.loadResources(ProvisionUtils.headerIconResources())
            .then(() => {
                this.setState({isLoading: false});
            })
            .catch(() => {
                console.error('Error loading resources');
            });
    }

    private changeTheme = () => {
        //Change theme
        const newTheme = store.getState().windowReducer.theme === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK;
        store.dispatch(setTheme(newTheme));
    }

    render(){
        return (<>
            {
                !this.state.isLoading &&
                <div className={`header-wrapper`}>
                    <div className={`navigation-wrapper`}>
                        <div className={`navigation-item`}>
                            {/*<FontAwesomeIcon className={"expanded-menu-icon"} icon={faHandshake} />*/}
                            <Icon className={"navigation-icon"} icon={IconType.faCompass} />
                            <span className={"navigation-label"}>Menus</span>
                            <Icon className={"navigation-sub-icon"} icon={IconType.faAngleDown} />
                            <NavigationSubMenu></NavigationSubMenu>
                        </div>
                        <div className={`navigation-item`}>
                            <Icon className={"navigation-icon"} icon={IconType.faAddressCard} />
                            <span className={"navigation-label"}>Contact Me</span>
                            <Icon className={"navigation-sub-icon"} icon={IconType.faAngleDown} />
                            <ContactsSubMenu></ContactsSubMenu>
                        </div>
                        <div className={`navigation-item`}>
                            <Icon className={"navigation-icon"} icon={IconType.faGithubAlt} />
                            <span className={"navigation-label"}>GitHub</span>
                            <Icon className={"navigation-sub-icon"} icon={IconType.faLink} />
                        </div>
                        <div className={`navigation-item`} onClick={this.changeTheme}>
                            <Icon className={"navigation-icon"} icon={IconType.faPalette} />
                            <span className={"navigation-label"}>Theme</span>
                            {this.props.theme === ThemeType.DARK &&
                                <Icon className={"navigation-sub-icon"} icon={IconType.faMoon} />}
                            {this.props.theme === ThemeType.LIGHT &&
                                <Icon className={"navigation-sub-icon"} icon={IconType.faSun} />}
                        </div>
                    </div>
                </div>
            }
            </>)
    }
}

export default connect(
    (state: any, ownProps) => {
        const { theme } = state.windowReducer;
        return {
            theme,
        }
    })(Navigation);