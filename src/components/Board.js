import React from 'react'
import Fleet from './Fleet.js';
import Grid from './Grid.js';
import moveEngine from './moveEngine.js';
import './styles.css'

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        this.playerGrid = new Fleet();
        this.enemyGrid = new Fleet();
        this.enemyGrid.randomlyPlaceShips();
        this.playerGrid.randomlyPlaceShips();
        this.state = {
            enemySquares: this.enemyGrid.squares.slice(),
            playerSquares: this.playerGrid.squares.slice(),
        }
        this.hoverIndex = -1;

    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = () => {
        if (this.hoverIndex >= 0) {
            this.playerGrid.removeShip(this.hoverIndex);
            this.playerGrid.toggleOrientation();
            this.playerGrid.placeShip(this.hoverIndex, false);
            this.setState({ playerSquares: this.playerGrid.squares.slice() })
        }
    }

    handleShipPlacement = (index) => {
        if (this.playerGrid.isOrganizingFleet) {

            let shipPlaced = this.playerGrid.placeShip(index, true);
            if (shipPlaced) {
                this.setState({ playerSquares: this.playerGrid.squares });

                if (!this.playerGrid.isOrganizingFleet) {
                    console.log("game start");
                }
            }
        }

    }

    handleEnemyGridClick = (index) => {
        if (!this.enemyGrid.wasAlreadyAttackedAt(index)) {
            this.enemyGrid.attackSquare(index)
            this.setState({ enemySquares: this.enemyGrid.squares.slice() });
            moveEngine.attack(this.playerGrid);
            this.setState({ playerSquares: this.playerGrid.squares.slice() });
        }

    }

    handleOceanMouseOver = (index) => {
        if (this.playerGrid.isOrganizingFleet()) {
            this.hoverIndex = index;
            let shipPlaced = this.playerGrid.placeShip(index, false);
            if (shipPlaced) this.setState({ playerSquares: this.playerGrid.squares.slice() });
        }

    }

    handleOceanMouseOut = (index) => {
        if (this.playerGrid.isOrganizingFleet()) {
            this.hoverIndex = -1;
            let shipRemoved = this.playerGrid.removeShip(index);
            if (shipRemoved) this.setState({ playerSquares: this.playerGrid.squares.slice() });
        }
    }

    handleSonarMouseOver = (index) => {

    }

    handleSonarMouseOut = (index) => {

    }

    render() {

        return (
            <div>

                {/* <div className={"sonar-container"}> */}
                <Grid
                    squares={this.state.enemySquares}
                    isPlayersGrid={false}
                    onClick={this.handleEnemyGridClick}
                    onMouseOver={this.handleSonarMouseOver}
                    onMouseOut={this.handleSonarMouseOut}
                />
                {/* <div className={"sonar-ring"}></div>
               
                </div> */}
                <Grid
                    onClick={this.handleShipPlacement}
                    onMouseOver={this.handleOceanMouseOver}
                    onMouseOut={this.handleOceanMouseOut}
                    squares={this.state.playerSquares}
                    isPlayersGrid={true}
                    isOrganizingFleet={this.playerGrid.isOrganizingFleet()} />
            </div>
        )
    }

}