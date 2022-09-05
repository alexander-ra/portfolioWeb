import React from 'react';
import './Header.scss';

interface HeaderProps {
}

interface HeaderState {
}

class Header extends React.Component<HeaderProps, HeaderState> {


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
            </div>
        </div>
        )
    }
}

export default Header;
