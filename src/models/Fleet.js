import random from '../utils/random.js';
import Ships from './Ships.js';
import Direction from './Direction.js';

export default class Fleet {

    constructor() {
        this.shipIndex = 0;
        this.harboredShips = Ships.slice();
        this.fleetHealth = this.harboredShips.reduce(function (acc, current) {
            return acc + current.images.length;
        }, 0);
        this.currentShip = this.harboredShips.pop();
        this.squares = [];
        for (let i = 0; i < 100; i++) {
            this.squares[i] = { image: undefined, isHorizontal: false, isTemporary: false, wasAttacked: false };
        }
        this.isPlacingHorizontally = true;
        this.placementIndex = 54;
    }

    changePlacementIndex = (newLocation) =>{
        this.placementIndex = newLocation;
        this.placeShip(true);
    }

    toggleOrientation = () => {
        this.removeTemporaryShip(this.placementIndex);
        this.isPlacingHorizontally = !this.isPlacingHorizontally;
        this.placeShip(this.placementIndex, true);
    }

    isAlive = () => {
        return this.fleetHealth > 0;
    }

    attackSquare = (index) => {
        this.squares[index].wasAttacked = true;
        let isHit = this.squares[index].image !== undefined;
        if (isHit) this.fleetHealth--;
        return isHit;
    }

    wasAttackedAt = (index) => {
        return this.squares[index].wasAttacked;
    }

    isOrganizingFleet() {
        return this.currentShip !== undefined;
    }

    nextShip() {
        if (this.harboredShips.length > 0) {
            this.currentShip = this.harboredShips.pop();
        } else {
            this.currentShip = undefined;
        }
    }

    randomlyPlaceShips = () => {
        while (this.currentShip) {
            let location;
            do {
                location = this.getRandomLocation(this.currentShip.images.length);
            }
            while (!this.isValidPlacement(location));
            this.placementIndex = location;
            this.placeShip(false);
        }
    }

    getRandomLocation(length) {
        this.isPlacingHorizontally = random.flipCoin();
        let location;
        if (this.isPlacingHorizontally) {
            location = random.between(0, length + 1) + random.between(0, 10) * 10;
        }
        else {
            location = random.between(0, length + 1) * 10 + random.between(0, 10);
        }
        return location;
    }

    isValidPlacement = (index) => {
        if (!this.currentShip) return false;
        const length = this.currentShip.images.length;
        if (this.isPlacingHorizontally) {
            if (length + (index % 10) < 11) {
                for (let i = index; i < (index + length); i++) {
                    if (this.squares[i].image !== undefined) {
                        return false;
                    }
                }
                return true;
            }
        } else {
            if (Math.trunc(index / 10) + length < 11) {
                for (let i = index; i < (index + (length * 10)); i += 10) {
                    if (this.squares[i].image !== undefined) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }

    placeShip = (isTemporary) => {
        if (this.isOrganizingFleet()) {
            if (this.isValidPlacement(this.placementIndex) || (isTemporary && this.isValidShipLocation(this.placementIndex))) {
                if (this.isPlacingHorizontally) {
                    this.placeShipHorizontally(this.placementIndex, isTemporary);
                } else {
                    this.placeShipVertically(this.placementIndex, isTemporary);
                }
                if (!isTemporary) { this.nextShip(); }
            }
        }
    }

    placeShipHorizontally = (index, isTemporary) => {
        for (let i = 0; i < this.currentShip.images.length; i++) {
            if (isTemporary) {
                this.squares[index + i].isTemporary = true;
            } else {
                this.squares[index + i].image = this.currentShip.images[i];
                this.squares[index + i].isHorizontal = true;
            }
        }
    }

    placeShipVertically(index, isTemporary) {
        for (let i = 0; i < this.currentShip.images.length; i++) {
            if (isTemporary) {
                this.squares[index + i * 10].isTemporary = true;
            } else {
                this.squares[index + i * 10].image = this.currentShip.images[i];
                this.squares[index + i * 10].isHorizontal = false;
            }
        }
    }

    removeHorizontalShip(index, length) {
        for (let i = 0; i < length; i++) {
            this.squares[index + i].isTemporary = false;
        }
    }

    removeVerticalShip(index, length) {
        for (let i = 0; i < length; i++) {
            this.squares[index + i * 10].isTemporary = false;
        }
    }

    isValidShipLocation = (index) => {
        if (!this.currentShip) return false;
        const length = this.currentShip.images.length;
        if (this.isPlacingHorizontally) {
            return (length + (index % 10) < 11);
        } else {
            return (Math.trunc(index / 10) + length < 11);
        }
    }

    moveShipPlacement(direction) {
        if (!this.currentShip) return;
        if (this.isPlacingHorizontally) {
            this.moveHorionztalShip(direction);
        } else {
            this.moveVerticalShip(direction);
        }
    }

    moveHorionztalShip(direction) {
        const length = this.currentShip.images.length;
        let newLocation = this.placementIndex + direction;
        if (this.placementIndex < 10 && direction === Direction.UP) { // on top edge and moving up
            newLocation = 90 + (this.placementIndex % 10);
        } else if (this.placementIndex > 89 && direction === Direction.DOWN) { // on bottom edge and moving down
            newLocation = 0 + (this.placementIndex % 10);
        } else if (this.placementIndex % 10 + length === 10 && direction === Direction.RIGHT) { // on right edge and moving right
            newLocation = this.placementIndex - (this.placementIndex % 10);
        } else if (this.placementIndex % 10 === 0 && direction === Direction.LEFT) { // on left edge and moving left
            newLocation = this.placementIndex + 10 - length;
        }
        this.removeTemporaryShip(this.placementIndex);
        this.placementIndex = newLocation;
        this.placeShip(true);
    }

    moveVerticalShip(direction) {
        const length = this.currentShip.images.length;
        let shipBottomIndex = this.placementIndex + (length - 1) * 10;
        let newLocation = this.placementIndex + direction;
        if (this.placementIndex < 10 && direction === Direction.UP) { // on top edge and moving up
            newLocation = (10 - length) * 10 + this.placementIndex;
        } else if (shipBottomIndex > 89 && direction === Direction.DOWN) { // on bottom edge and moving down
            newLocation = (this.placementIndex % 10);
        } else if (this.placementIndex % 10 === 9 && direction === Direction.RIGHT) { // on right edge and moving right
            newLocation = this.placementIndex - 9;
        } else if (this.placementIndex % 10 === 0 && direction === Direction.LEFT) { // on left edge and moving left
            newLocation = this.placementIndex + 9;
        }
        this.removeTemporaryShip(this.placementIndex);
        this.placementIndex = newLocation;
        this.placeShip(true);
    }

    removeTemporaryShip = () => {
        const length = this.currentShip.images.length;
        if (this.isValidShipLocation(this.placementIndex)) {
            if (this.isPlacingHorizontally) {
                this.removeHorizontalShip(this.placementIndex, length);
            } else {
                this.removeVerticalShip(this.placementIndex, length);
            }
        }
    }
}