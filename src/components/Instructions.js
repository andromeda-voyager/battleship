import React from 'react'
import './Instructions.css'

export default function Instructions(props) {
    return (
        <div className={'instructions'}>
            <span>Place your ships!</span>
            <div className={'keybindings'}>
                <span>Left Click:</span> <span>Place Ship</span>
                <span>Spacebar:</span> <span>Change Ship Orientation</span>
            </div>
        </div>
    )
}

