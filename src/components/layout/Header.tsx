import React from 'react';
import './Header.scss';
import store from "../../store/store";
import {setTheme} from '../../reducers/window/windowAction';
import {ThemeType} from "../core/ThemeType";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressCard, faAngleDown, faArrowDown, faAt, faCircleDot, faCompass, faFaceSadCry, faLink, faMoon,
    faPalette, faSun} from "@fortawesome/free-solid-svg-icons";
import { faGithubAlt } from '@fortawesome/free-brands-svg-icons';
import {connect} from "react-redux";
import {ChessBoardModel} from "../../reducers/chessBoard/chessBoardReducer";
import NavigationSubMenu from "./NavigationSubMenu";
import ContactsSubMenu from "./ContactsSubMenu";
import BackButton from "./BackButton";
import cubesReducer from "../../reducers/cube/cubeReducer";

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
                            <FontAwesomeIcon className={"navigation-icon"} icon={faCompass} />
                            <span className={"navigation-label"}>Menus</span>
                            <FontAwesomeIcon className={"navigation-sub-icon"} icon={faAngleDown} />
                            <NavigationSubMenu></NavigationSubMenu>
                        </div>
                        <div className={`navigation-item`}>
                            <FontAwesomeIcon className={"navigation-icon"} icon={faAddressCard} />
                            <span className={"navigation-label"}>Contact Me</span>
                            <FontAwesomeIcon className={"navigation-sub-icon"} icon={faAngleDown} />
                            <ContactsSubMenu></ContactsSubMenu>
                        </div>
                        <div className={`navigation-item`}>
                            <FontAwesomeIcon className={"navigation-icon"} icon={faGithubAlt} />
                            <span className={"navigation-label"}>GitHub</span>
                            <FontAwesomeIcon className={"navigation-sub-icon"} icon={faLink} />
                        </div>
                        <div className={`navigation-item`} onClick={this.changeTheme}>
                            <FontAwesomeIcon className={"navigation-icon"} icon={faPalette} />
                            <span className={"navigation-label"}>Theme</span>
                            {this.props.theme === ThemeType.DARK &&
                                <FontAwesomeIcon className={"navigation-sub-icon"} icon={faMoon} />}
                            {this.props.theme === ThemeType.LIGHT &&
                                <FontAwesomeIcon className={"navigation-sub-icon"} icon={faSun} />}
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