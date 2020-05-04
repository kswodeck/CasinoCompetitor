/* eslint-disable no-unused-vars */
var diceArr = [];
var holdArr = [];
var rollRemaining = true;
var diceRolls = 0;
var currentRollScore = 0;
var currentBet = 50;
var diceRollDiv = document.getElementById('farkle-roll-div');
var diceRollButton = document.getElementById('farkle-roll-button');
var farkleEndButton = document.getElementById('farkle-end-button');
var handRankingHeading = document.getElementById('roll-ranking-heading');
var rollScoreHeading = document.getElementById('roll-score-heading');

function farkleRoll() {
  diceRollButton.disabled = true;
  if (handRankingHeading.innerText == 'Farkle') {
    rollRemaining = false;
    diceRollButton.innerText = 'Play Again';
    farkleEndButton.setAttribute('disabled');
  }
  if (diceRolls > 0 && rollRemaining == true) {
    for (let curDice = 0; curDice < 6; curDice++) {
      if (diceArr[curDice].isHeld) {
        console.log(diceArr[curDice]);
        console.log('is held');
        holdArr.push(diceArr[curDice]);
      }
    }
    console.log('holdArr');
    console.log(holdArr);
    diceArr = [];
    diceArr.push.apply(diceArr, holdArr);
    console.log('diceArr');
    console.log(diceArr);
    holdArr = [];
  } else if (rollRemaining == true) {
    farkleEndButton.removeAttribute('disabled');
  }
  handRankingHeading.style.display = 'none';
  rollScoreHeading.style.display = 'none';
  for (var currentDice = 0; currentDice < 6; currentDice++) {
    let currentDiceElement = document.getElementsByClassName('dice')[currentDice];
    let holdCurrentDice = document.getElementById('hold' + currentDice);
    if (!diceArr[currentDice]) {
      currentDiceElement.classList.remove('spin-grow');
      holdCurrentDice.classList.add('text-opacity');
      diceArr.push(new Dice(roll(), currentDiceElement));
      setTimeout(function() {animateDice(currentDiceElement);}, 20);
    } else {
      holdCurrentDice.classList.remove('text-opacity');
    }
    currentDiceElement.src = diceArr[currentDice].imgSrc;
  }
  handRankingHeading.innerText = getRollValues();
  rollScoreHeading.innerText = getRollScore();
  setTimeout(function() {
    if (handRankingHeading.innerText == 'Farkle') {
      handRankingHeading.style.color = 'crimson';
    } else {
      handRankingHeading.style.color = 'darkblue';
    }
    handRankingHeading.style.display = 'block';

    if (rollScoreHeading.innerText != '0') {
      rollScoreHeading.style.display = 'block';
    } else {
      rollScoreHeading.style.display = 'none';
    }
  }, 350);
  diceRolls++;
  setTimeout(function() {diceRollButton.disabled = false;}, 300);
}

class Dice {
  constructor(numValue, currentDice) {
    this.numValue = numValue;
    this.imgSrc = 'images/' + numValue + 'dice.png';
    this.isHeld = false;
    this.canHold = false;
    this.diceElement = currentDice;
    this.singleDiceWorth = 0;
    this.multipleDiceWorth = 0;
    this.allDiceWorth = 0;
  }
}

function roll() {
  return Math.floor((Math.random() * 6) + 1);
}

function animateDice(diceElement) {
  diceElement.classList.add('spin-grow');
}

function getRollValues() {
  let resultText = 'Farkle';
  const highestSameKindCount = classifySameKinds(diceArr);
  let isStraightRoll;
  let isAllPairsRoll = isAllPairs(diceArr);
  let isTripletsRoll = isTwoTriplets(diceArr);
  highestSameKindCount == 1 ? isStraightRoll = true : isStraightRoll = false;
  let isRollScoring = classifyDiceWorth(highestSameKindCount, isAllPairsRoll, isTripletsRoll, isStraightRoll);
  if (isStraightRoll) {
    resultText = 'Straight';
  } else if (isAllPairsRoll) {
    resultText = '3 Pairs';
  } else if (isTripletsRoll) {
    resultText = '2 Triplets';
  } else if (highestSameKindCount == 6) {
    resultText = '6 of a Kind';
  } else if (highestSameKindCount == 5) {
    resultText = '5 of a Kind';
  } else if (highestSameKindCount == 4) {
    resultText = '4 of a Kind';
  } else if (highestSameKindCount == 3) {
    resultText = '3 of a Kind';
  } else if (isRollScoring) {
    resultText = 'Scoring Dice Rolled';
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
        enableDiceHold(diceArr[i]);
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
    return true;
  }
  function isTwoTriplets(diceArr) {
    for (let i = 0; i < 6; i++) {
      if (!diceArr[i].hasTriple) {
        return false;
      }
    }
    return true;
  }
  function classifyDiceWorth(highestSameKind, isAllPairs, isTriplets, isStraight) {
    let scoringDiceExists = false;
    for (let i = 0; i < 6; i++) {
      if (highestSameKind < 3) {
        if (diceArr[i].numValue == 1 || diceArr[i].numValue == 5) {
          enableDiceHold(diceArr[i]);
          scoringDiceExists = true;
          if (diceArr[i].numValue == 1) {
            diceArr[i].singleDiceWorth = 2 * currentBet;
          } else {
            diceArr[i].singleDiceWorth = 1 * currentBet;
          }
        } else if (isStraight == true || isAllPairs) {
          enableDiceHold(diceArr[i]);
          scoringDiceExists = true;
          diceArr[i].allDiceWorth = 30 * currentBet;
          diceArr[i].multipleDiceWorth = 30 * currentBet;
        } else {
          disableDiceHold(diceArr[i]);
        }
      } else {
        scoringDiceExists = true;
        if (isTriplets) {
          enableDiceHold(diceArr[i]);
          diceArr[i].allDiceWorth = 50 * currentBet;
          diceArr[i].multipleDiceWorth = 50 * currentBet;
        } else if (diceArr[i].sameKindCount == 3) {
          enableDiceHold(diceArr[i]);
          if (diceArr[i].numValue == 1) {
            diceArr[i].multipleDiceWorth = 6 * currentBet;
            diceArr[i].singleDiceWorth = 2 * currentBet;
          } else {
            diceArr[i].multipleDiceWorth = (diceArr[i].numValue * 2) * currentBet;
            if (diceArr[i].numValue == 5) {
              diceArr[i].singleDiceWorth = 1 * currentBet;
            }
          }
        } else if (diceArr[i].sameKindCount == 4) {
          enableDiceHold(diceArr[i]);
          diceArr[i].multipleDiceWorth = 20 * currentBet;
        } else if (diceArr[i].sameKindCount == 5) {
          enableDiceHold(diceArr[i]);
          diceArr[i].multipleDiceWorth = 40 * currentBet;
        } else if (diceArr[i].sameKindCount == 6) {
          enableDiceHold(diceArr[i]);
          diceArr[i].multipleDiceWorth = 60 * currentBet;
          diceArr[i].allDiceWorth = 60 * currentBet;
        } else if (diceArr[i].sameKindCount < 3) {
          if (diceArr[i].numValue == 1) {
            enableDiceHold(diceArr[i]);
            diceArr[i].singleDiceWorth = 2 * currentBet;
          } else if (diceArr[i].numValue == 5) {
            enableDiceHold(diceArr[i]);
            diceArr[i].singleDiceWorth = 1 * currentBet;
          } else {
            disableDiceHold(diceArr[i]);
          }
        }
      }
    }
    return scoringDiceExists;
  }
}

function getRollScore() {
  let score = 0;
  let multipleDiceScored = false;
  for (let i = 0; i < 6; i++) {
    if (diceArr[i].allDiceWorth != 0) {
      return diceArr[i].allDiceWorth;
    } else if (diceArr[i].multipleDiceWorth != 0 && multipleDiceScored == false) {
      score = score + diceArr[i].multipleDiceWorth;
      multipleDiceScored = true;
    } else if (diceArr[i].singleDiceWorth != 0) {
      score = score + diceArr[i].singleDiceWorth;
    }
  }
  return score;
}

function disableDiceHold(...args) {
  for (let i=0; i < args.length; i++) {
    args[i].canHold = false;
    args[i].diceElement.classList.remove('interactive-img');
    // args[i].diceElement.removeAttribute('onclick');
    args[i].diceElement.parentElement.removeAttribute('onclick');
  }
}

function enableDiceHold(...args) {
  for (let i=0; i < args.length; i++) {
    args[i].canHold = true;
    let holdId = args[i].diceElement.parentElement.childNodes[1].getAttribute('id');
    args[i].diceElement.classList.add('interactive-img');
    // args[i].diceElement.setAttribute('onclick', "toggleDiceHold('" + holdId + "')");
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