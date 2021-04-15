export default function GridSquares(props) {

    let rows = [];
    let type = props.isPlayersGrid ? "ocean" : "sonar";
    for (let i = 0; i < props.squares.length; i++) {
        let targetClasses = "";
        if (props.squares[i].wasAttacked) {
            targetClasses += props.squares[i].isAnchored ? "square targeted hit" : "square targeted miss";
        }
        rows.push(<div
            className={`square`}
            key={i}
            onClick={() => props.onClick(i)}
            onMouseOver={() => props.onMouseOver(i)}
            onMouseOut={() => props.onMouseOut(i)}
            >
            <img
                className={props.squares[i].isHorizontal ? undefined : 'vertical'}
                src={props.isPlayersGrid ? props.squares[i].image : undefined} alt={""} />
            <div className={targetClasses}></div>
        </div>);
    }
    return (
        <div onKeyDown={props.handleKeyDown} className={`grid ` + type}>
            {rows}
 
        </div>
    )



}