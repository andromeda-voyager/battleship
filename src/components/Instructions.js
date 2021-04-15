import React from 'react'
import './styles.css'

export default function Instructions(props) {

    let show = props.show;
    return (
        <div className={show ? 'instructions' : 'instructions hidden'}>
            <span>Place your ships!</span>
            <div className={'keybindings'}>
                <span>Left Click:</span> <span>Place Ship</span>
                <span>Spacebar:</span> <span>Change Ship Orientation</span>
            </div>
        </div>
    )
}

