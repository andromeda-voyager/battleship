import random from "../utils/random";

var selectedTargets = [];
var unattackedLocations = Object.keys(Array.apply(0, Array(100))).map(Number);
var hitLocations = [];
var connectedHits = [];
var targetsInIgnoredAreas = [];
var ignoredTargetsMin = 4; // values from 3 to 5 are ideal

const attack = (grid) => {
    let target = pickTarget();
    let isHit = grid.attackSquare(target);
    if (isHit) {
        hitLocations.push(target);
        connectedHits.push(target);
        addPotentialTargets(target, isHit);
    }

    // If there are no selected targets, no information can be gathered from previous hits
    if (selectedTargets.length === 0) {
        connectedHits = [];
    }

}

function pickTarget() {
    return selectedTargets.length > 0 ? pickFromSelectedTargets() : pickRandomTarget();
}

function addDirectedTargets(previousTarget, direction) {
    let potentialTarget = previousTarget + direction;
    if (areConnected(previousTarget, potentialTarget)) {
        if (hasBeenAttacked(potentialTarget)) {
            if (isHitAt(potentialTarget)) {
                addDirectedTargets(potentialTarget, direction);
            }  // miss found
        } else {
            selectedTargets.push(potentialTarget);
        }
    }
    // not connected (edge reached)
}

function pickRandomTarget() {
    let targetIndex;
    let target = unattackedLocations.length < 70 ? getTargetFromIgnoredAreas() : getRandomUnattacked();
    targetIndex = unattackedLocations.indexOf(target);
    unattackedLocations.splice(targetIndex, 1);
    return target;
}

function getRandomUnattacked() {
    return unattackedLocations[random.between(0, unattackedLocations.length)];
}

function getTargetFromIgnoredAreas() {
    addFromIgnoredRows();
    addFromIgnoredColumns();
    if (targetsInIgnoredAreas.length > 0) {
        let targetIndex = random.between(0, targetsInIgnoredAreas.length)
        let target = targetsInIgnoredAreas[targetIndex];
        targetsInIgnoredAreas = [];
        return target;
    }
    return getRandomUnattacked(); // returns a random location if no target was found 
}

function addFromIgnoredRows() {
    let consecutiveLocations = 1;
    for (let i = 1; i < unattackedLocations.length; i++) {
        if (inSameRowAndConsecutive(unattackedLocations[i], unattackedLocations[i - 1])) {
            consecutiveLocations++;
            if (consecutiveLocations >= ignoredTargetsMin) {
                targetsInIgnoredAreas.push(unattackedLocations[i] - Math.floor(ignoredTargetsMin / 2));
                consecutiveLocations = Math.floor(ignoredTargetsMin / 2) - 1;
            }
        } else { // next row or hit/miss inbetween locations
            consecutiveLocations = 1;
        }
    }
}

function inSameRowAndConsecutive(targetOne, targetTwo) {
    return Math.abs(targetOne - targetTwo) === 1 && areInSameRow(targetOne, targetTwo);

}

function addFromIgnoredColumns(ignoredTargetsMin) {
    let consecutiveLocations = 0;
    let previousLocation = -11; // if value was between 0 and -10, it could lead to a false previous location
    let location;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) { // j starts at 1 because (i=0,j=0) is set to previousLocation 
            location = i + 10 * j;
            if (!hasBeenAttacked(location)) {
                if (inSameColumnAndConsecutive(previousLocation, location)) {
                    consecutiveLocations++;
                    if (consecutiveLocations >= ignoredTargetsMin) {
                        targetsInIgnoredAreas.push(location - Math.floor(ignoredTargetsMin / 2) * 10);
                        consecutiveLocations = Math.floor(ignoredTargetsMin / 2) - 1;
                    }
                } else { // next column
                    consecutiveLocations = 1;
                }
            }
            else { // location was already attacked/targeted
                consecutiveLocations = 0;
            }
            previousLocation = location;
        }
    }
}

function inSameColumnAndConsecutive(targetOne, targetTwo) {
    return Math.abs(targetOne - targetTwo) === 10 && areInSameColumn(targetOne, targetTwo);
}

function pickFromSelectedTargets() {
    let targetIndex = random.between(0, selectedTargets.length)
    let target = selectedTargets[targetIndex];
    selectedTargets.splice(targetIndex, 1);
    targetIndex = unattackedLocations.indexOf(target);
    if (targetIndex !== -1) {
        unattackedLocations.splice(targetIndex, 1);
    }
    return target;
}

function addPotentialTargets(previousTarget) {
    let direction = getDirectionOfShip();
    if (direction) { // is 0 if direction can not be determined
        selectedTargets = [];
        addDirectedTargets(previousTarget, direction);
        addDirectedTargets(previousTarget, -direction);
    } else {
        addTargetsConnectedTo(previousTarget);
    }
}

function addTargetsConnectedTo(location) {
    selectedTargets = [];
    if (areConnected(location, location - 1) && !hasBeenAttacked(location - 1)) {
        selectedTargets.push(location - 1);
    }
    if (areConnected(location, location + 1) && !hasBeenAttacked(location + 1)) {
        selectedTargets.push(location + 1);
    }
    if (areConnected(location, location + 10) && !hasBeenAttacked(location + 10)) {
        selectedTargets.push(location + 10);
    }
    if (areConnected(location, location - 10) && !hasBeenAttacked(location - 10)) {
        selectedTargets.push(location - 10);
    }
}

function isValidLocation(location) {
    return location >= 0 && location < 100;
}

function areConnected(targetOne, targetTwo) {
    let direction = Math.abs(targetOne - targetTwo);
    if (!isValidLocation(targetOne) || !isValidLocation(targetTwo)) return false;
    switch (direction) {
        case 1: return areInSameRow(targetOne, targetTwo);
        case 10: return true;
        default: return false;
    }
}

// returns the direction of the ship (10, -10, 1, -1, 0)
// returns 0 if the direction can not be calculated (when there is only one connected hit)
function getDirectionOfShip() {
    return connectedHits.length > 1 ?
        connectedHits[1] - connectedHits[0] : 0;
}

function hasBeenAttacked(location) {
    return unattackedLocations.indexOf(location) === -1;
}

function isHitAt(location) {
    return hitLocations.indexOf(location) !== -1;
}

function areInSameRow(locationOne, locationTwo) {
    return (Math.trunc(locationOne / 10) === Math.trunc(locationTwo / 10));
}

function areInSameColumn(locationOne, locationTwo) {
    return (Math.trunc(locationOne % 10) === Math.trunc(locationTwo % 10));
}

const TargetEngine = {
    attack,
}

export default TargetEngine;