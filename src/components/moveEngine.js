import random from "../utils/random";

var selectedTargets = [];
var untargetedLocations = Object.keys(Array.apply(0, Array(100))).map(Number);
var hitLocations = [];
var connectedHitLocations = [];
var isShipDirectionKnown = false;

const attack = (grid) => {

    console.log("connectedHitLocations " + connectedHitLocations);
    console.log("selectedTargets " + selectedTargets);

    if(selectedTargets.length == 0) {
        connectedHitLocations = [];
    }
    let target = pickTarget();
    let isHit = grid.attackSquare(target);
    if (isHit) {
        hitLocations.push(target);
        console.log("hit at " + target);
    }
    addPotentialTargets(target, isHit);
    console.log("\n");
    console.log("connectedHitLocations " + connectedHitLocations);
    console.log("selectedTargets " + selectedTargets);
}

function getNextDirectedTarget(previous, next) {
    let direction = next - previous;
    if (isConnectedTarget(previous, next)) {
        if (hasBeenTargeted(next)) {
            if (hasBeenHit(next)) {
                return getNextDirectedTarget(previous, next + direction);
            } else { // miss found
                return -1;
            }
        }
        return -1;

    }
    return -1; // not connected due to edge
}

function isConnectedTarget(previous, next) {
    let direction = next - previous;
    switch (direction) {
        case 1: return !isInRightColumn(previous);
        case -1: return !isInLeftColumn(previous);
        case 10: return !isInBottomRow(previous);
        case -10: return !isInTopRow(previous);
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
    console.log("----picked random target-----" + target);
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
    console.log("----picked selected target-----" + target);

    return target;
}

function addPotentialTargets(target, isHit) {
    if (isHit) {
        if (connectedHitLocations.length > 0) {
            isShipDirectionKnown = true; // might merge and remove this
            let direction = target - connectedHitLocations[connectedHitLocations.length - 1];
            let nextTarget = getNextDirectedTarget(target, target + direction)
            if (nextTarget !== -1) selectedTargets.push(target + direction);

            nextTarget = getNextDirectedTarget(target, target - direction)
            if (nextTarget !== -1) selectedTargets.push(target - direction);
        } else {
            addConnectedLocations(target);
        }
        connectedHitLocations.push(target);
    }
}

function addConnectedLocations(location) {
    selectedTargets = [];
    if (isConnectedTarget(location, location - 1)) {
        selectedTargets.push(location - 1);
    }
    if (isConnectedTarget(location, location + 1)) {
        selectedTargets.push(location + 1);
    }
    if (isConnectedTarget(location, location + 10)) {
        selectedTargets.push(location + 10);
    }
    if (isConnectedTarget(location, location - 10)) {
        selectedTargets.push(location - 10);
    }
}

function hasBeenTargeted(location) {
    return untargetedLocations.indexOf(location) === -1;
}

function hasBeenHit(location) {
    return hitLocations.indexOf(location) === -1;
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

const moveEngine = {
    attack,
}

export default moveEngine;