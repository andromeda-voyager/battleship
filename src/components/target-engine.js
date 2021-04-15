import random from "../utils/random";

var selectedTargets = [];
var untargetedLocations = Object.keys(Array.apply(0, Array(100))).map(Number);
var hitLocations = [];
var connectedHits = [];

const attack = (grid) => {
    let target = pickTarget();
    let isHit = grid.attackSquare(target);
    if (isHit) {
        hitLocations.push(target);
        connectedHits.push(target);
    }
    addPotentialTargets(target, isHit);
    if (selectedTargets.length === 0) {
        connectedHits = [];
    }
}

function getNextDirectedTarget(target, potentialTarget) {
    let direction = potentialTarget - target;
    if (isConnectedTarget(target, potentialTarget)) {
        if (hasBeenTargeted(potentialTarget)) {
            if (isHitAt(potentialTarget)) {
                return getNextDirectedTarget(potentialTarget, potentialTarget + direction);
            } else { // miss found
                return -1;
            }
        }
        return potentialTarget;

    }
    return -1; // not connected (edge reached)
}

function isConnectedTarget(target, potentialTarget) {
    let direction = potentialTarget - target;
    switch (direction) {
        case 1: return !isInRightColumn(target);
        case -1: return !isInLeftColumn(target);
        case 10: return !isInBottomRow(target);
        case -10: return !isInTopRow(target);
        default: return false;
    }
}

function pickTarget() {
    return selectedTargets.length > 0 ? pickFromSelectedTargets() : pickRandomTarget();
}

function pickRandomTarget() {
    let targetIndex = random.between(0, untargetedLocations.length)
    let target = untargetedLocations[targetIndex];
    untargetedLocations.splice(targetIndex, 1);
    return target;
}

function pickFromSelectedTargets() {
    let targetIndex = random.between(0, selectedTargets.length)
    let target = selectedTargets[targetIndex];
    selectedTargets.splice(targetIndex, 1);
    targetIndex = untargetedLocations.indexOf(target);
    if (targetIndex !== -1) {
        untargetedLocations.splice(targetIndex, 1);
    }
    return target;
}

function addPotentialTargets(target, isHit) {
    if (isHit) {
        let direction = getDirectionOfShip();
        if (direction) {
            selectedTargets = [];
            let nextTarget = getNextDirectedTarget(target, target + direction)
            if (nextTarget !== -1) {
                selectedTargets.push(nextTarget);
            }
            nextTarget = getNextDirectedTarget(target, target - direction)
            if (nextTarget !== -1) {
                selectedTargets.push(nextTarget);
            }
        } else {
            addConnectedTargets(target);
        }
    }
}

// returns the direction of the ship (10, -10, 1, -1)
// returns 0 if the direction can not be calculated (when there is only one connected hit)
function getDirectionOfShip() {
    return connectedHits.length > 1 ?
        connectedHits[1] - connectedHits[0] : 0;
}

function addConnectedTargets(location) {
    selectedTargets = [];
    if (isConnectedAndUntargeted(location, location - 1)) {
        selectedTargets.push(location - 1);
    }
    if (isConnectedAndUntargeted(location, location + 1)) {
        selectedTargets.push(location + 1);
    }
    if (isConnectedAndUntargeted(location, location + 10)) {
        selectedTargets.push(location + 10);
    }
    if (isConnectedAndUntargeted(location, location - 10)) {
        selectedTargets.push(location - 10);
    }
}

function isConnectedAndUntargeted(target, potentialTarget) {
    return isConnectedTarget(target, potentialTarget) && !hasBeenTargeted(potentialTarget);
}

function hasBeenTargeted(location) {
    return untargetedLocations.indexOf(location) === -1;
}

function isHitAt(location) {
    return hitLocations.indexOf(location) !== -1;
}

function isInLeftColumn(index) {
    return index % 10 === 0;
}

function isInRightColumn(index) {
    return index % 10 === 9;
}

function isInBottomRow(index) {
    return index > 89
}

function isInTopRow(index) {
    return index < 10
}

const TargetEngine = {
    attack,
}

export default TargetEngine;