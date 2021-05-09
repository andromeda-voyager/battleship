import './Grid.css'

export default function Grid(props) {

    let rows = [];
    let type = props.isPlayersGrid ? "ocean" : "sonar";
    for (let i = 0; i < props.squares.length; i++) {
        let targetClasses = "";
        if (props.squares[i].wasAttacked) {
            targetClasses += props.squares[i].image !== undefined ? "targeted hit" : "targeted miss";
        }
        let squareClasses = "square";
        if(props.squares[i].isTemporary && props.isOrganizingFleet) {
            squareClasses += props.squares[i].image ? " red" : " green";
        }
        rows.push(<div
            className={squareClasses}
            key={i}
            onClick={() => props.onClick(i)}
            onMouseOver={props.isPlayersGrid ? () => props.onMouseOver(i): undefined}
            onMouseOut={props.isPlayersGrid ? () => props.onMouseOut(i): undefined}
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