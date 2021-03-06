import React from 'react'
import Fleet from '../models/Fleet.js';
import Grid from './Grid.js';
import Instructions from './Instructions.js';
import TargetEngine from '../models/target-engine.js';
import './GameBoard.css'
import Controls from './Controls.js';

export default class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.playerFleet = new Fleet();
        this.enemyFleet = new Fleet();
        this.enemyFleet.randomlyPlaceShips();
        this.state = {
            isUsingControls: false,
            enemySquares: this.enemyFleet.squares.slice(),
            playerSquares: this.playerFleet.squares.slice(),
        }
    }

    reset = () => {
        this.playerFleet = new Fleet();
        this.enemyFleet = new Fleet();
        this.enemyFleet.randomlyPlaceShips();
        this.setState({
            isUsingControls: false,
            enemySquares: this.enemyFleet.squares.slice(),
            playerSquares: this.playerFleet.squares.slice(),
        });
        TargetEngine.reset();
    }

    componentDidMount() {
        document.addEventListener("keydown",  this.changeShipOrientaion);
        document.addEventListener("keyup",  this.keyupHandler);

    }

    keyupHandler(e) {
        if(e.keyCode === 32) {
            e.preventDefault();
            e.stopPropagation();
        }
    }


    componentWillUnmount() {
        document.removeEventListener("keydown", this.changeShipOrientaion);
        document.removeEventListener("keyup", this.keyupHandler);
    }

    changeShipOrientaion = (e) => {
        if (e.keyCode === 32 || e.type === "click") {
            this.playerFleet.toggleOrientation();
            this.setState({ playerSquares: this.playerFleet.squares.slice() })
        }
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
        if (this.playerFleet.isOrganizingFleet() && !this.state.isUsingControls) {
            this.playerFleet.removeTemporaryShip();
            this.playerFleet.changePlacementIndex(index);
            this.setState({ playerSquares: this.playerFleet.squares.slice() });
        }
    }

    addShipAt(index) {
        this.hoverIndex = index;
        let shipPlaced = this.playerFleet.placeShip(index, true);
        if (shipPlaced) this.setState({ playerSquares: this.playerFleet.squares.slice() });
    }

    removeShipAt(index) {
        let shipRemoved = this.playerFleet.removeTemporaryShip(index);
        if (shipRemoved) this.setState({ playerSquares: this.playerFleet.squares.slice() });
    }

    toggleControls = () => {
        this.playerFleet.removeTemporaryShip();
        if (!this.state.isUsingControls) {
            this.playerFleet.changePlacementIndex(44);
        }
        else {
            this.playerFleet.removeTemporaryShip();
        }
        this.setState({
            playerSquares: this.playerFleet.squares.slice(),
            isUsingControls: !this.state.isUsingControls
        });
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
                    squares={this.state.playerSquares}
                    isPlayersGrid={true}
                    isOrganizingFleet={this.playerFleet.isOrganizingFleet()}>
                </Grid>

                {isGameOver &&
                    <button className="option-button" onClick={this.reset}>
                        New Game
                    </button>
                }

                {this.playerFleet.isOrganizingFleet() &&
                    <div className="controls-instructions-container">
                        {!this.state.isUsingControls && <Instructions />}
                        <button className="option-button" onClick={this.toggleControls}>
                            {this.state.isUsingControls ? "Turn off controls" : "Turn on controls"}
                        </button>

                        {this.state.isUsingControls &&
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
