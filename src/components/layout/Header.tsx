import React from 'react';
import './Header.scss';
import store from "../../store/store";
import {setTheme} from '../../reducers/window/windowAction';
import {ThemeType} from "../core/ThemeType";

interface HeaderProps {
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
        <div className={`header-wrapper`}>
            <div className={`navigation-wrapper`}>
                <div className={`navigation-item`}>
                    Experience
                </div>
                <div className={`navigation-item`}>
                    Approach
                </div>
                <div className={`navigation-item`}>
                    Demos
                </div>
                <div className={`navigation-item`}>
                    Contacts
                </div>
                <div className={`navigation-item`} onClick={this.changeTheme}>
                    Theme
                </div>
            </div>
        </div>
        )
    }
}

export default Header;
