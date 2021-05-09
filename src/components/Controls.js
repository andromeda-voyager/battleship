import Direction from "../models/Direction"
import rotate from '../assets/rotate.svg';
import './Controls.css'


export default function Controls(props) {


    return (
        <div className="controls-container">
            <button className="place-ship-button" onClick={props.place} >Place Ship</button>

            <button onClick={() => props.move(Direction.UP)} className="arrow up"></button>

            <div className="horizontal-controls-container">
                <button onClick={() => props.move(Direction.LEFT)} className="arrow left"></button>

                <button className="rotate-button" onClick={props.rotate}>
                    <img src={rotate} alt={""} />
                </button>
                <button onClick={() => props.move(Direction.RIGHT)} className="arrow right"></button>

            </div>
            <button onClick={() => props.move(Direction.DOWN)} className="arrow down"></button>
        </div>
    )

}