import React from 'react'
import Fleet from './Fleet.js';
import Grid from './Grid.js';
import Instructions from './Instructions.js';
import TargetEngine from './target-engine.js';
import './styles.css'
import Controls from './controls.js';

export default class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.playerFleet = new Fleet();
        this.enemyFleet = new Fleet();
        this.enemyFleet.randomlyPlaceShips();
        this.state = {
            usingControls: false,
            enemySquares: this.enemyFleet.squares.slice(),
            playerSquares: this.playerFleet.squares.slice(),
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.changeShipOrientaion);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.changeShipOrientaion);
    }

    changeShipOrientaion = () => {
        this.playerFleet.toggleOrientation();
        this.setState({ playerSquares: this.playerFleet.squares.slice() })
    }

    placeShip = () => {
        if (this.playerFleet.isOrganizingFleet()) {
            this.playerFleet.placeShip(false);
            this.setState({ playerSquares: this.playerFleet.squares });
            if (!this.playerFleet.isOrganizingFleet()) {
                document.removeEventListener("keydown", this.changeShipOrientaion);
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
        if (this.playerFleet.isOrganizingFleet() && !this.state.usingControls) {
            this.playerFleet.changePlacementIndex(index);
            this.setState({ playerSquares: this.playerFleet.squares.slice() });
        }
    }

    addShipAt(index) {
        this.hoverIndex = index;
        let shipPlaced = this.playerFleet.placeShip(index, true);
        if (shipPlaced) this.setState({ playerSquares: this.playerFleet.squares.slice() });
    }

    handleOceanMouseOut = (index) => {
        if (this.playerFleet.isOrganizingFleet() && !this.state.usingControls) {
            this.playerFleet.removeTemporaryShip();
            this.setState({ playerSquares: this.playerFleet.squares.slice() });
        }
    }

    removeShipAt(index) {
        let shipRemoved = this.playerFleet.removeTemporaryShip(index);
        if (shipRemoved) this.setState({ playerSquares: this.playerFleet.squares.slice() });
    }

    toggleControls = () => {
        this.setState({ usingControls: !this.state.usingControls });
        this.usingControls = !this.usingControls;
        if (this.usingControls) {
            this.playerFleet.changePlacementIndex(44);
        }
        else {
            this.playerFleet.removeTemporaryShip();
        }
        this.setState({ playerSquares: this.playerFleet.squares.slice() });
    }

    moveShipPlacement = (direction) => {
        this.playerFleet.moveShipPlacement(direction);
        this.setState({ playerSquares: this.playerFleet.squares.slice() });
    }



    render() {
        let endgameMessage = this.playerFleet.isAlive() ? "You won!" : "Game Over"
        let isGameOver = !this.enemyFleet.isAlive() || !this.playerFleet.isAlive();
        return (
            <div className={'board'}>
                {!this.playerFleet.isOrganizingFleet() &&
                    <Grid
                        squares={this.state.enemySquares}
                        isPlayersGrid={false}
                        onClick={this.handleEnemyGridClick}>
                    </Grid>}
                {!this.playerFleet.isOrganizingFleet() &&
                    <div className={"game-end-message-wrapper"}>
                        {<span className={isGameOver ? 'game-end-message' : 'game-end-message hidden'}>{endgameMessage}</span>}
                    </div>}
                <Grid
                    onClick={this.placeShip}
                    onMouseOver={this.handleOceanMouseOver}
                    onMouseOut={this.handleOceanMouseOut}
                    squares={this.state.playerSquares}
                    isPlayersGrid={true}
                    isOrganizingFleet={this.playerFleet.isOrganizingFleet()}>
                </Grid>

                {this.playerFleet.isOrganizingFleet() &&
                    <div className="controls-instructions-container">
                        {!this.state.usingControls && <Instructions />}
                        <button className="toggle-controls-button" onClick={() => this.toggleControls()}>
                            {this.state.usingControls ? "Turn off controls" : "Turn on controls"}
                        </button>

                        {this.state.usingControls &&
                            <Controls
                                move={this.moveShipPlacement}
                                rotate={this.changeShipOrientaion}
                                place={this.placeShip}
                            />
                        }
                    </div>
                }
            </div>
        )
    }

}