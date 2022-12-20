import React from 'react';
import './Header.scss';
import store from "../../store/store";
import {setTheme} from '../../reducers/window/windowAction';
import {ThemeType} from "../core/ThemeType";
import {connect} from "react-redux";
import {ChessBoardModel} from "../../reducers/chessBoard/chessBoardReducer";
import NavigationSubMenu from "./NavigationSubMenu";
import ContactsSubMenu from "./ContactsSubMenu";
import BackButton from "./BackButton";
import cubesReducer from "../../reducers/cube/cubeReducer";
import Icon from "../common/icon/Icon";
import {IconType} from "../common/icon/IconType";

interface HeaderProps {
    theme: ThemeType;
    cubeOpened: boolean;
}

interface HeaderState {
}

class Header extends React.Component<HeaderProps, HeaderState> {

    private changeTheme = () => {
        //Change theme
        const newTheme = store.getState().windowReducer.theme === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK;
        store.dispatch(setTheme(newTheme));
    }

    render(){
        return (
            <>{this.props.cubeOpened && <>
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
                <BackButton />
            </>}
            </>
        )
    }
}

export default connect(
    (state: any, ownProps) => {
        const { theme } = state.windowReducer;
        const { cubeOpened } = state.cubesReducer;
        return {
            theme,
            cubeOpened
        }
    })(Header);