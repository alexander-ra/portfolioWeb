import React from 'react';
import './Flower.scss';

interface FlowerProps {
    flowerVisible?: any;
}

/**
 * Flower component. This component is responsible for displaying the flower behind the cube.
 *
 * @author Alexander Andreev
 */
class Flower extends React.Component<FlowerProps> {

    render(){
        return (
            <div className={`flower-wrapper ${this.props.flowerVisible ? "opened" : ""}`}>
                <div className={"flower"}></div>
                <div className={"flower-center"}></div>
            </div>
        )
    }
}

export default Flower;
