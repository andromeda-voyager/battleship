import React from 'react'
import Fleet from './Fleet.js';
import Grid from './Grid.js';
import Instructions from './Instructions.js';
import TargetEngine from './target-engine.js';
import './styles.css'

export default class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.playerFleet = new Fleet();
        this.enemyFleet = new Fleet();
        this.enemyFleet.randomlyPlaceShips();
        //this.playerFleet.randomlyPlaceShips(); 

        this.state = {
            enemySquares: this.enemyFleet.squares.slice(),
            playerSquares: this.playerFleet.squares.slice(),
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
            this.playerFleet.removeShip(this.hoverIndex);
            this.playerFleet.toggleOrientation();
            this.playerFleet.placeShip(this.hoverIndex, false);
            this.setState({ playerSquares: this.playerFleet.squares.slice() })
        }
    }

    handleShipPlacement = (index) => {
        if (this.playerFleet.isOrganizingFleet()) {
            let shipPlaced = this.playerFleet.placeShip(index, true);
            if (shipPlaced) {
                this.setState({ playerSquares: this.playerFleet.squares });
                if (!this.playerFleet.isOrganizingFleet()) {
                    document.removeEventListener("keydown", this.handleKeyDown);
                }
            }
        }
    }

    handleEnemyGridClick = (index) => {
        if (this.isValidAttack(index)) {
            this.enemyFleet.attackSquare(index)
            this.setState({ enemySquares: this.enemyFleet.squares.slice() });
            TargetEngine.attack(this.playerFleet);
            this.setState({ playerSquares: this.playerFleet.squares.slice() });
        }
    }

    isValidAttack = (index) => {
        return !this.playerFleet.isOrganizingFleet()
            && !this.enemyFleet.wasAttackedAt(index)
            && this.enemyFleet.isAlive()
            && this.playerFleet.isAlive();

    }

    handleOceanMouseOver = (index) => {
        if (this.playerFleet.isOrganizingFleet()) {
            this.hoverIndex = index;
            let shipPlaced = this.playerFleet.placeShip(index, false);
            if (shipPlaced) this.setState({ playerSquares: this.playerFleet.squares.slice() });
        }

    }

    handleOceanMouseOut = (index) => {
        if (this.playerFleet.isOrganizingFleet()) {
            this.hoverIndex = -1;
            let shipRemoved = this.playerFleet.removeShip(index);
            if (shipRemoved) this.setState({ playerSquares: this.playerFleet.squares.slice() });
        }
    }

    render() {
        let endgameMessage = this.playerFleet.isAlive() ? "You won!" : "Game Over"
        let isGameOver = !this.enemyFleet.isAlive() || !this.playerFleet.isAlive();
        return (
            <div className={'board'}>
                {!this.playerFleet.isOrganizingFleet() && <Grid
                    squares={this.state.enemySquares}
                    isPlayersGrid={false}
                    onClick={this.handleEnemyGridClick}>
                </Grid>}
                {!this.playerFleet.isOrganizingFleet() &&
                    <div className={"game-end-message-wrapper"}>
                        {<span className={isGameOver ? 'game-end-message' : 'game-end-message hidden'}>{endgameMessage}</span>}
                    </div>}
                <Grid
                    onClick={this.handleShipPlacement}
                    onMouseOver={this.handleOceanMouseOver}
                    onMouseOut={this.handleOceanMouseOut}
                    squares={this.state.playerSquares}
                    isPlayersGrid={true}
                    isOrganizingFleet={this.playerFleet.isOrganizingFleet()}>
                </Grid>

                {this.playerFleet.isOrganizingFleet() && <Instructions />}

            </div>
        )
    }

}