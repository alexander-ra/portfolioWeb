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
    navigationItemsShown: boolean;
    contactsItemsShown: boolean;
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
    constructor(props: NavigationProps) {
        super(props);
        this.state = {
            isLoading: true,
            navigationItemsShown: false,
            contactsItemsShown: false
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

    private toggleNavigationItems = () => {
        this.setState({navigationItemsShown: !this.state.navigationItemsShown});

        if (this.state.contactsItemsShown) {
            this.setState({contactsItemsShown: false});
        }
    }

    private toggleContactsItems = () => {
        this.setState({contactsItemsShown: !this.state.contactsItemsShown});

        if (this.state.navigationItemsShown) {
            this.setState({navigationItemsShown: false});
        }
    }

    render(){
        return (<>
            {
                !this.state.isLoading &&
                <div className={`header-wrapper`}>
                    <div className={`navigation-wrapper`}>
                        <div className={`navigation-item`} onClick={this.toggleNavigationItems} onMouseEnter={
                            () => {
                                this.setState({
                                    navigationItemsShown: true,
                                    contactsItemsShown: false
                                })
                            }
                        }>
                            <Icon className={"navigation-icon"} icon={IconType.faCompass} />
                            <span className={"navigation-label"}>Menus</span>
                            <Icon className={"navigation-sub-icon"} icon={IconType.faAngleDown} />
                            {this.state.navigationItemsShown && <NavigationSubMenu></NavigationSubMenu>}
                        </div>
                        <div className={`navigation-item`} onClick={this.toggleContactsItems} onMouseEnter={
                            () => {
                                this.setState({
                                    navigationItemsShown: false,
                                    contactsItemsShown: true
                                })
                            }
                        }>
                            <Icon className={"navigation-icon"} icon={IconType.faAddressCard} />
                            <span className={"navigation-label"}>Contact Me</span>
                            <Icon className={"navigation-sub-icon"} icon={IconType.faAngleDown} />
                            {this.state.contactsItemsShown && <ContactsSubMenu></ContactsSubMenu>}
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