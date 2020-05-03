/* eslint-disable no-unused-vars */
var diceArr = [];
var rollRemaining = true;
var diceRolls = 0;
var diceRollDiv = document.getElementById('farkle-roll-div');
var diceRollButton = document.getElementById('farkle-roll-button');
var handRankingHeading = document.getElementById('hand-ranking-heading');

function farkleRoll() {
  diceRollButton.disabled = true;
  if (diceRolls > 0 && rollRemaining == true) {
    for (let curDice = 0; curDice < 6; curDice++) {
      document.getElementsByClassName('dice')[curDice].classList.remove('spin-grow');
    }
    diceArr = [];
  }
  for (var currentDice = 0; currentDice < 6; currentDice++) {
    let currentDiceElement = document.getElementsByClassName('dice')[currentDice];
    let holdCurrentDice = document.getElementById('hold' + currentDice);
    holdCurrentDice.classList.add('text-opacity');
    diceArr.push(new Dice(roll(), currentDiceElement));
    currentDiceElement.src = diceArr[currentDice].imgSrc;
    setTimeout(function() {animateDice();}, 20);
    // currentDiceElement.classList.add('interactive-img');
  }
  handRankingHeading.innerText = getRollValues();
  handRankingHeading.style.display = 'block';
  diceRolls++;
  setTimeout(function() {diceRollButton.disabled = false;}, 200);
}

class Dice {
  constructor(numValue, currentDice) {
    this.numValue = numValue;
    this.imgSrc = 'images/' + numValue + 'dice.png';
    this.isHeld = false;
    this.canHold = false;
    this.diceElement = currentDice;
  }
}

function roll() {
  return Math.floor((Math.random() * 6) + 1);
}

function animateDice() {
  let diceElements = document.getElementsByClassName('dice');
  for (let i=0; i<diceElements.length; i++) {
    diceElements[i].classList.add('spin-grow');
  }
}

function getRollValues() {
  let resultText = 'FARKLE';
  const highestSameKindCount = classifySameKinds(diceArr);
  let isStraight;
  highestSameKindCount == 1 ? isStraight = true : isStraight = false;
  if (isStraight) {
    resultText = 'Straight';
    } else if (isAllPairs(diceArr)) {
      resultText = '3 Pairs';
    } else if (isTwoTriplets(diceArr)) {
      resultText = '2 Triplets';
    }
  return resultText;
  function classifySameKinds(diceArr) {
    for (var i = 0; i < 6; i++) {
      var currentKindCount = 1;
      for (let j = 5; j >= 0; j--) {
        if (i !== j) {
          if (diceArr[i].numValue === diceArr[j].numValue) {
            currentKindCount++;
          }
        }
      }
      diceArr[i].sameKindCount = currentKindCount;
      if (currentKindCount === 2) {
        diceArr[i].hasPair = true;
      } else if (currentKindCount === 3) {
        diceArr[i].hasTriple = true;
      } else {
        diceArr[i].hasPair = false;
        diceArr[i].hasTriple = false;
      }
    }
    let maxMatches = Math.max(diceArr[0].sameKindCount, diceArr[1].sameKindCount, diceArr[2].sameKindCount, 
      diceArr[3].sameKindCount, diceArr[4].sameKindCount, diceArr[5].sameKindCount);
    for (let i = 0; i < 6; i++) {
      if (maxMatches == 1) {
        diceArr[i].isStraight = true;
        diceArr[i].canHold = true;
      } else {
        diceArr[i].isStraight = false;
      }
    }
    return maxMatches;
  }
  function isAllPairs(diceArr) {
    for (let i = 0; i < 6; i++) {
      if (!diceArr[i].hasPair) {
        return false;
      }
    }
    enableDiceHold(diceArr[0], diceArr[1], diceArr[2], diceArr[3], diceArr[4], diceArr[5]);
    return true;
  }
  function isTwoTriplets(diceArr) {
    for (let i = 0; i < 6; i++) {
      if (!diceArr[i].hasTriple) {
        return false;
      }
    }
    enableDiceHold(diceArr[0], diceArr[1], diceArr[2], diceArr[3], diceArr[4], diceArr[5]);
    return true;
  }
}

function disableDiceHold(...args) {
  for (let i=0; i < args.length; i++) {
    args[i].canHold = false;
    // args[i].diceElement.classList.remove('interactive-img', 'spin-grow');
    args[i].diceElement.removeAttribute('onclick');
    args[i].diceElement.parentElement.removeAttribute('onclick');
  }
}

function enableDiceHold(...args) {
  for (let i=0; i < args.length; i++) {
    args[i].canHold = true;
    let holdId = args[i].diceElement.parentElement.childNodes[1].getAttribute('id');
    // args[i].diceElement.classList.add('interactive-img', 'spin-grow');
    args[i].diceElement.setAttribute('onclick', "toggleDiceHold('" + holdId + "')");
    args[i].diceElement.parentElement.setAttribute('onclick', "toggleDiceHold('" + holdId + "')");
  }
}

function toggleDiceHold(currentHoldElement) {
  const holdElement = document.getElementById(currentHoldElement);
  const diceNum = parseInt(currentHoldElement.replace(/hold/, ''));
  if (!diceArr[diceNum].isHeld) {
    diceArr[diceNum].isHeld = true;
    holdElement.classList.toggle('text-opacity');
  } else {
    diceArr[diceNum].isHeld = false;
  }
}