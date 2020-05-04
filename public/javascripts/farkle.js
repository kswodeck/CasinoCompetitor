/* eslint-disable no-unused-vars */
var diceArr = [];
var holdArr = [];
var rollRemaining = true;
var diceRolls = 0;
var diceHeld = 0;
var currentRollScore = 0;
var currentBet = 50;
var diceRollDiv = document.getElementById('farkle-roll-div');
var diceRollButton = document.getElementById('farkle-roll-button');
var farkleEndButton = document.getElementById('farkle-end-button');
var rollRankingHeading = document.getElementById('roll-ranking-heading');
var rollScoreHeading = document.getElementById('roll-score-heading');
var rollScoreDiv = document.getElementById('farkle-roll-score-div');


function farkleRoll() {
  diceRollButton.disabled = true;
  if (diceRolls > 0) {
    var heldDice = 0;
    for (let curDice = 0; curDice < 6; curDice++) {
      if (diceArr[curDice].isHeld) {
        holdArr.push(diceArr[curDice]);
        document.getElementById('hold' + curDice).classList.add('text-opacity');
        heldDice++;
      }
    }
    if (heldDice == diceHeld) { //this means no additional dice were held this round
      diceRolls == 1;
      diceRollButton.disabled = false;
      return; //display a popup here. Exit the function
    }
    diceHeld = heldDice;
    console.log('holdArr');
    console.log(holdArr);
    diceArr = [];
    diceArr.push.apply(diceArr, holdArr);
    holdArr = [];
    console.log('diceArr');
    console.log(diceArr);
    for (let curDice = 0; curDice < diceHeld; curDice++) {
      console.log('curDice: ' + curDice + ' diceHeld: ' + diceHeld);
      let curDiceElement = document.getElementsByClassName('dice')[curDice];
      curDiceElement.src = diceArr[curDice].imgSrc;
      console.log('Slot ' + curDice + ' changed to ' + curDice + "'s img");
      // document.getElementById('hold' + curDice).classList.remove('text-opacity');
      disableDiceHold(diceArr[curDice]);
    }
  } else if (rollRemaining == true) {
    farkleEndButton.removeAttribute('disabled');
  }
  if (rollScoreHeading.innerText != '0') {
    saveCurrentRollScore(rollScoreHeading.innerText);
    console.log('saved score');
  }
  rollRankingHeading.style.display = 'none';
  rollScoreHeading.style.display = 'none';
  for (var currentDice = 0 + diceHeld; currentDice < 6; currentDice++) {
    let currentDiceElement = document.getElementsByClassName('dice')[currentDice];
    let holdCurrentDice = document.getElementById('hold' + currentDice);
    currentDiceElement.classList.remove('spin-grow');
    holdCurrentDice.classList.add('text-opacity');
    diceArr.push(new Dice(roll(), currentDiceElement));
    setTimeout(function() {animateDice(currentDiceElement);}, 20);
    currentDiceElement.src = diceArr[currentDice].imgSrc;
  }
  rollRankingHeading.innerText = getRollValues();
  rollScoreHeading.innerText = getRollScore();
  currentRollScore = currentRollScore + parseInt(rollScoreHeading.innerText);
  setTimeout(function() {
    if (rollRankingHeading.innerText == 'Farkle') {
      rollRankingHeading.style.color = 'crimson';
    } else {
      rollRankingHeading.style.color = 'darkblue';
    }
    rollRankingHeading.style.display = 'block';

    if (rollScoreHeading.innerText != '0') {
      rollScoreHeading.style.display = 'block';
    } else {
      rollScoreHeading.style.display = 'none';
    }
  }, 350);
  diceRolls++;
  if (rollRankingHeading.innerText == 'Farkle') {
    rollRemaining = false;
    diceRollButton.innerText = 'Play Again';
    farkleEndButton.setAttribute('disabled', 'disabled');
    diceRollButton.onclick = function() {window.location.reload();}
  }
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
  const highestSameKindCount = classifySameKinds();
  let isStraightRoll;
  let isAllPairsRoll = isAllPairs();
  let isTripletsRoll = isTwoTriplets();
  highestSameKindCount == 1 && diceHeld == 0 ? isStraightRoll = true : isStraightRoll = false;
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
  function classifySameKinds() {
    for (var i = 0 + diceHeld; i < 6; i++) {
      var currentKindCount = 1;
      for (let j = 5; j >= 0 + diceHeld; j--) {
        if (i != j) {
          if (diceArr[i].numValue == diceArr[j].numValue) {
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
    var maxArr = [];
    for (let x = 0 + diceHeld; x < 6; x++) {
      let curValue = diceArr[x].sameKindCount;
      maxArr.push(curValue);
    }
    // let maxMatches = Math.max(diceArr[0].sameKindCount, diceArr[1].sameKindCount, diceArr[2].sameKindCount, 
    //   diceArr[3].sameKindCount, diceArr[4].sameKindCount, diceArr[5].sameKindCount);
      let maxMatches = Math.max(...maxArr);
    for (let i = 0 + diceHeld; i < 6; i++) {
      if (maxMatches == 1 && diceHeld == 0) {
        diceArr[i].isStraight = true;
        enableDiceHold(diceArr[i]);
      } else {
        diceArr[i].isStraight = false;
      }
    }
    return maxMatches;
  }
  function isAllPairs() {
    if (diceHeld != 0) {
      return false;
    }
    for (let i = 0 + diceHeld; i < 6; i++) {
      if (!diceArr[i].hasPair) {
        return false;
      }
    }
    return true;
  }
  function isTwoTriplets() {
    if (diceHeld != 0) {
      return false;
    }
    for (let i = 0 + diceHeld; i < 6; i++) {
      if (!diceArr[i].hasTriple) {
        return false;
      }
    }
    return true;
  }
  function classifyDiceWorth(highestSameKind, isAllPairs, isTriplets, isStraight) {
    let scoringDiceExists = false;
    for (let i = 0 + diceHeld; i < 6; i++) {
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
  for (let i = 0 + diceHeld; i < 6; i++) {
    if (diceArr[i].allDiceWorth != 0) {
      return diceArr[i].allDiceWorth;
    } else if (diceArr[i].multipleDiceWorth != 0 && multipleDiceScored == false) {
      score = score + diceArr[i].multipleDiceWorth;
      multipleDiceScored = true;
    } else if (diceArr[i].singleDiceWorth != 0) {
      if (diceArr[i].numValue == 5 && diceArr[i].sameKindCount > 2) {
        console.log('already counted fives as a group');
      } else {
        score = score + diceArr[i].singleDiceWorth;
      }
    }
  }
  return score;
}

function saveCurrentRollScore(score) {
  if (diceRolls > 0) {
    const span1 = document.createElement('span'), span2 = document.createElement('span');
    span1.className = 'sm-text farkle-turn-tally'; span2.className = 'result sm-text farkle-turn-tally';
    rollScoreDiv.appendChild(span1);
    rollScoreDiv.appendChild(span2);
    span1.innerText = document.getElementsByClassName('result').length + ': ';
    span2.innerHTML = score + '<br>';
    rollScoreDiv.style.display = 'block';
  }
}

function endTurn() {
  endTurnConfirm(currentRollScore);
}

function endTurnConfirm(score) {
  const dialog = document.getElementById('confirmDialog');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    setTimeout(function() {dialog.close()}, 30000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('confirmButton').onclick = function() {
    dialog.close();
    endTurnDialog(score);
  }
}

function endTurnDialog(score) {
  const dialog = document.getElementById('endTurnDialog');
  document.getElementById('endTurnPopupSpan').innerText = score;
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    setTimeout(function() {dialog.close(); window.location.reload();}, 5000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('endTurnCancel').onclick = function() {
    dialog.close();
    window.location.reload();
  }
}

function disableDiceHold(...args) {
  for (let i = 0; i < args.length; i++) {
    args[i].canHold = false;
    args[i].diceElement.classList.remove('interactive-img');
    // args[i].diceElement.removeAttribute('onclick');
    args[i].diceElement.parentElement.removeAttribute('onclick');
  }
}

function enableDiceHold(...args) {
  for (let i = 0; i < args.length; i++) {
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