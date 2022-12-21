import React, { Suspense } from 'react';
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
import BrowserUtils from "../../utils/BrowserUtils";
import {ProvisionUtils} from "../../utils/ProvisionUtils";
import Navigation from "./Navigation";
import {Page} from "../../models/common/Page";

interface HeaderProps {
    theme: ThemeType;
    cubeOpened: boolean;
    currentPage: Page;
}

class Header extends React.Component<HeaderProps> {

    private changeTheme = () => {
        //Change theme
        const newTheme = store.getState().windowReducer.theme === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK;
        store.dispatch(setTheme(newTheme));
    }

    render(){
        return (
            <>
                {this.props.cubeOpened &&
                    <Suspense>
                        <Navigation />
                    </Suspense>
                }
                {this.props.currentPage !== Page.LANDING &&
                    <Suspense>
                        <BackButton />
                    </Suspense>
                }
            </>
        )
    }
}

export default connect(
    (state: any, ownProps) => {
        const { theme } = state.windowReducer;
        const { cubeOpened } = state.cubesReducer;
        const { currentPage } = state.stagesReducer;
        return {
            theme,
            cubeOpened,
            currentPage
        }
    })(Header);