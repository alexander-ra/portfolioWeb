import React from 'react';
import './Flower.scss';

interface FlowerProps {
    flowerVisible?: any;
}

class Flower extends React.Component<FlowerProps> {


    render(){
        return (
        <>
            <div className={`flower-wrapper ${this.props.flowerVisible ? "opened" : ""}`}>
                <div className={"flower"}></div>
            </div>
            <div className={"flower-center"}></div>
        </>
        )
    }
}

export default Flower;
