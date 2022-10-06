import React from 'react';
import './Flower.scss';

interface FlowerProps {
    flowerVisible?: any;
    isClosing?: boolean
}

class Flower extends React.Component<FlowerProps> {


    render(){
        return (
            <div className={`flower-wrapper ${this.props.flowerVisible ? "opened" : ""} ${this.props.isClosing ? "closing" : ""}`}>
                <div className={"flower"}></div>
                <div className={"flower-center"}></div>
            </div>
        )
    }
}

export default Flower;
