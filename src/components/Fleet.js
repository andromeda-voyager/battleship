import random from '../utils/random.js';
import Ships from './Ships.js';

export default class Fleet {

    constructor() {
        this.shipIndex = 0;
        this.harboredShips = Ships.slice();
        this.fleetHealth = this.harboredShips.reduce(function(acc, current) {
            return acc + current.images.length;
        },0);
        this.currentShip = this.harboredShips.pop();
        this.squares = [];
        for (let i = 0; i < 100; i++) {
            this.squares[i] = { image: undefined, isHorizontal: false, isAnchored: false, wasAttacked: false };
        }
        this.isPlacingHorizontally = true;
    }

    toggleOrientation = () => {
        this.isPlacingHorizontally = !this.isPlacingHorizontally;
    }

    isAlive = () => {
        return this.fleetHealth > 0;
    }

    attackSquare = (index) => {
        if (this.isValidLocation(index)) {
            this.squares[index].wasAttacked = true;
            let isHit = this.squares[index].isAnchored;
            if(isHit) this.fleetHealth--;
            return isHit;
        }
    }

    isValidLocation = (index) => {
        return index >= 0 && index < 100
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
            this.placeShip(location, true);
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
                    if (this.squares[i].isAnchored) {
                        return false;
                    }
                }
                return true;
            }
        } else {
            if (Math.trunc(index / 10) + length < 11) {
                for (let i = index; i < (index + (length * 10)); i += 10) {
                    if (this.squares[i].isAnchored) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }

    placeShip = (index, isAnchored) => {
        if (this.isValidPlacement(index)) {
            if (this.isPlacingHorizontally) {
                this.placeShipHorizontally(index, isAnchored);
            } else {
                this.placeShipVertically(index, isAnchored);
            }
            if (isAnchored) { this.nextShip(); }
            return true;
        }
        return false;

    }

    placeShipHorizontally = (index, isAnchored) => {
        for (let i = 0; i < this.currentShip.images.length; i++) {
            this.squares[index + i] = {
                image: this.currentShip.images[i],
                isHorizontal: true,
                isAnchored: isAnchored,
                wasAttacked: false
            };
        }
    }

    placeShipVertically(index, isAnchored) {
        for (let i = 0; i < this.currentShip.images.length; i++) {
            this.squares[index + i * 10] = {
                image: this.currentShip.images[i],
                isHorizontal: false,
                isAnchored: isAnchored,
                wasAttacked: false
            };
        }
    }

    removeHorizontalShip(index, length) {
        for (let i = 0; i < length; i++) {
            this.squares[index + i] = { image: undefined, isHorizontal: false, isAnchored: false, wasAttacked: false };
        }
    }

    removeVerticalShip(index, length) {
        for (let i = 0; i < length; i++) {
            this.squares[index + i * 10] = { image: undefined, isHorizontal: false, isAnchored: false, wasAttacked: false };
        }

    }

    removeShip = (index) => {
        const length = this.currentShip.images.length;
        if (this.isValidPlacement(index)) {

            if (this.isPlacingHorizontally) {
                this.removeHorizontalShip(index, length);
            } else {
                this.removeVerticalShip(index, length);
            }
            return true;

        }
        return false;
    }
}