import React from 'react';
import './Navigation.scss';
import store from "../../../reducers/store";
import {setTheme} from '../../../reducers/window/windowAction';
import {ThemeType} from "../../../models/common/ThemeType";
import {connect} from "react-redux";
import NavigationSubMenu from "./NavigationSubMenu";
import ContactsSubMenu from "./ContactsSubMenu";
import Icon from "../../common/Icon/Icon";
import {IconType} from "../../../models/common/IconType";
import {ProvisionUtils} from "../../../utils/ProvisionUtils";
import BrowserUtils from "../../../utils/BrowserUtils";

interface NavigationProps {
    theme: ThemeType;
}

interface NavigationState {
    isLoading: boolean;
    activeMenu: DropdownMenu;
}

enum DropdownMenu {
    NONE,
    NAVIGATION,
    CONTACTS
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
    constructor(props: NavigationProps) {
        super(props);
        this.state = {
            isLoading: true,
            activeMenu: DropdownMenu.NONE
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

    private toggleNavigationMenu = (menu: DropdownMenu) => {
        if (this.state.activeMenu === menu) {
            this.setState({activeMenu: DropdownMenu.NONE});
        } else {
            this.setState({activeMenu: menu});
        }
    }

    render(){
        return (<>
            {
                !this.state.isLoading &&
                <div className={`header-wrapper`}>
                    <div className={`navigation-wrapper`}>
                        <div className={`navigation-item`}
                             onClick={this.toggleNavigationMenu.bind(this, DropdownMenu.NAVIGATION)}
                             onMouseEnter={() => {
                                this.toggleNavigationMenu(DropdownMenu.NAVIGATION);
                            }}
                            onMouseLeave={() => {
                            this.toggleNavigationMenu(DropdownMenu.NONE);
                            }}
                        >
                            <Icon className={"navigation-Icon"} icon={IconType.faCompass} />
                            <span className={"navigation-label"}>Menus</span>
                            <Icon className={"navigation-sub-icon"} icon={IconType.faAngleDown} />
                            {this.state.activeMenu === DropdownMenu.NAVIGATION && <NavigationSubMenu />}
                        </div>
                        <div className={`navigation-item`} onClick={this.toggleNavigationMenu.bind(this, DropdownMenu.CONTACTS)}
                             onMouseEnter={() => {
                                this.toggleNavigationMenu(DropdownMenu.CONTACTS);
                            }}
                            onMouseLeave={() => {
                            this.toggleNavigationMenu(DropdownMenu.NONE);
                            }}
                        >
                            <Icon className={"navigation-Icon"} icon={IconType.faAddressCard} />
                            <span className={"navigation-label"}>Contact Me</span>
                            <Icon className={"navigation-sub-icon"} icon={IconType.faAngleDown} />
                            {this.state.activeMenu === DropdownMenu.CONTACTS && <ContactsSubMenu />}
                        </div>
                        <div className={`navigation-item`} onClick={this.toggleNavigationMenu.bind(this, DropdownMenu.NONE)}>
                            <Icon className={"navigation-Icon"} icon={IconType.faGithubAlt} />
                            <span className={"navigation-label"}>GitHub</span>
                            <Icon className={"navigation-sub-icon"} icon={IconType.faLink} />
                        </div>
                        <div className={`navigation-item`} onClick={() => {
                            this.changeTheme();
                            this.toggleNavigationMenu(DropdownMenu.NONE);
                        }}>
                            <Icon className={"navigation-Icon"} icon={IconType.faPalette} />
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