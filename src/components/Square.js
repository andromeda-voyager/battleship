import React from 'react'
import './styles.css'

export default function Square(props) {


    let classes = "";
    if (props.ship.wasTargeted) {
        classes += props.ship.isAnchored ? "targeted hit" : "targeted miss";
    }

    return (
        <div
            className={`square`}
            onClick={() => props.handleClick(props.index,)}
            onMouseOver={props.onMouseOver(props.index)}
            onMouseOut={props.onMouseOut(props.index)}
           >
            <img
                className={props.ship.isHorizontal ? undefined : 'vertical'}
                src={props.isPlayersSquare ? props.ship.image : undefined} alt={""} />
            <div className={classes}></div>
        </div>
    )
}

