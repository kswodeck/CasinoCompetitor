/* eslint-disable no-unused-vars */
var diceArr = [];
var holdArr = [];
var diceRolls = 0, diceHeld = 0, diceHeldThisRoll = 0, heldDiceScore = 0, totalScore = 0;
var currentBet = 50, currentCoinsBet = 0;
var hotDice = false;
const diceRollDiv = document.getElementById('farkle-roll-div');
const diceRollButton = document.getElementById('farkle-roll-button');
const farkleEndButton = document.getElementById('farkle-end-button');
const rollRankingHeading = document.getElementById('roll-ranking-heading');
const rollScoreHeading = document.getElementById('roll-score-heading');
const rollScoreDiv = document.getElementById('farkle-roll-score-div');
const totalScoreDiv = document.getElementById('farkle-total-score-div');
const totalScoreText = document.getElementById('total-score-text');
const pageTitle = document.getElementsByTagName('title')[0];
if (pageTitle.innerText == 'Competitive Farkle' || document.getElementById('page-heading').innerText == 'Competitive Farkle') {
  var totalCoinsSpan = document.getElementById('total-coins-span');
  var coinsInput = document.getElementById('coinsInput');
  var currentBetSpan = document.getElementById('current-bet-span');
  var winButton = document.getElementById('win-button');
  var currentWinSpan = document.getElementById('current-win-span');
  var betButton = document.getElementById('bet-button');
  var totalCoins = totalCoinsSpan.innerText;
  currentCoinsBet = 10;
  currentBet = 1;
  var updateCoinsStart, updateCoinsEnd;
  if (coinsInput.value <= 9 || coinsInput.value == null) {
    outOfCoinsDialog();
  }
}

function farkleRoll() {
  diceRollButton.setAttribute('disabled', 'disabled');
  currentBet = parseInt(currentBetSpan.innerText) / 10;
  if (totalCoins <= 9 && diceRolls === 0) {
    outOfCoinsDialog();
    return false;
  }
  currentWinSpan.innerText = 0;
  betButton.disabled = true;
  winButton.style.backgroundColor = 'crimson';
  winButton.style.boxShadow = '0 6px var(--darkcrimson)';
  if (diceRolls === 0) {
    updateCoinsStart = new Promise(function(resolve, reject) {
      totalCoins = totalCoins - currentCoinsBet;
      totalCoinsSpan.innerText = totalCoins;
      resolve(5);
    });
    updateStoredCoins(updateCoinsStart);
  }
  let continueRoll = farkleRollSetup();
  if (continueRoll == false) {
    return;
  }
  for (var currentDice = 0 + diceHeld; currentDice < 6; currentDice++) {
    let currentDiceElement = document.getElementsByClassName('dice')[currentDice];
    let holdCurrentDice = document.getElementById('hold' + currentDice);
    currentDiceElement.classList.remove('spin-grow');
    holdCurrentDice.classList.add('text-opacity');
    diceArr.push(new Dice(roll(), currentDiceElement));
    setTimeout(function() {animateDice(currentDiceElement);}, 10);
    currentDiceElement.src = diceArr[currentDice].imgSrc;
  }
  farkleRollTeardown();
  setTimeout(function() {diceRollButton.removeAttribute('disabled');}, 400);
}

function casualFarkleRoll() {
  diceRollButton.setAttribute('disabled', 'disabled');
  let continueRoll = farkleRollSetup();
  if (continueRoll == false) {
    return;
  }
  for (var currentDice = 0 + diceHeld; currentDice < 6; currentDice++) {
    let currentDiceElement = document.getElementsByClassName('dice')[currentDice];
    let holdCurrentDice = document.getElementById('hold' + currentDice);
    currentDiceElement.classList.remove('spin-grow');
    holdCurrentDice.classList.add('text-opacity');
    diceArr.push(new Dice(roll(), currentDiceElement));
    setTimeout(function() {animateDice(currentDiceElement);}, 10);
    currentDiceElement.src = diceArr[currentDice].imgSrc;
  }
  farkleRollTeardown();
  setTimeout(function() {diceRollButton.removeAttribute('disabled');}, 400);
}

function farkleRollSetup() {
  if (diceRolls > 0) {
    var totalDiceHeld = 0;
    for (let curDice = 0; curDice < 6; curDice++) {
      if (diceArr[curDice].isHeld) {
        holdArr.push(diceArr[curDice]);
        totalDiceHeld++;
      }
    }
    if (totalDiceHeld == diceHeld && !hotDice) { //this means no additional dice were held this round
      diceRollButton.removeAttribute('disabled');
      displayFarkleDialog('mustHoldDialog', 'mustHoldCancel');
      return false;
    }
    diceHeldThisRoll = diceHeld;
    diceHeld = totalDiceHeld;
    diceArr = [];
    diceArr.push.apply(diceArr, holdArr);
    holdArr = [];
    if (!hotDice) {
      for (let curDice = 0; curDice < diceHeld && curDice < 6; curDice++) {
        let curDiceElement = document.getElementsByClassName('dice')[curDice];
        curDiceElement.src = diceArr[curDice].imgSrc;
        document.getElementById('hold' + curDice).classList.remove('text-opacity');
        curDiceElement.classList.remove('interactive-img');
        curDiceElement.parentElement.removeAttribute('onclick');
      }
    }
  } else {
    farkleEndButton.removeAttribute('disabled');
  }
  if (diceRolls > 0 || hotDice) {
    heldDiceScore = saveCurrentRollScore();
    totalScore = heldDiceScore + totalScore;
    saveTotalScore();
  }
  if (hotDice) {
    diceHeld = 0;
    diceHeldThisRoll = 0;
    diceArr = [];
    hotDice = false;
    farkleEndButton.removeAttribute('disabled');
  }
  rollRankingHeading.style.display = 'none';
  rollScoreHeading.style.display = 'none';
  return true;
}

function farkleRollTeardown() {
  rollRankingHeading.innerText = getRollValues();
  rollScoreHeading.innerText = getRollScore();
  setTimeout(function() {
    if (rollRankingHeading.innerText == 'FARKLE') {
      rollRankingHeading.style.color = 'crimson';
      diceRollButton.innerText = 'Play Again';
      farkleEndButton.setAttribute('disabled', 'disabled');
      diceRollButton.setAttribute('onclick', 'window.location.reload(); return false');
      totalScoreText.innerText = 0;
      displayFarkleDialog('farkleDialog', 'farkleCancel');
    } else {
      rollRankingHeading.style.color = 'darkblue';
      diceRollButton.innerText = 'Roll Again';
    }
    rollRankingHeading.style.display = 'block';

    if (rollScoreHeading.innerText != '0') {
      rollScoreHeading.style.display = 'block';
    } else {
      rollScoreHeading.style.display = 'none';
    }
  }, 350);
  diceRolls++;
  var totalDiceCanHold = 0;
  new Promise(function(resolve, reject) {
    for (let curDice = 0; curDice < 6; curDice++) {
      if (diceArr[curDice].canHold) {
        totalDiceCanHold++;
      }
    }
    resolve(5);
  }).then(function() {
    if (totalDiceCanHold >= 6) {
      hotDice = true;
      for (let curDice = 0; curDice < 6; curDice++) {
          diceArr[curDice].isHeld = true;
          disableDiceHold(diceArr[curDice]);
          farkleEndButton.setAttribute('disabled', 'disabled');
          document.getElementById('hold' + curDice).classList.remove('text-opacity');
      }
      setTimeout(function() {
        displayFarkleDialog('hotDiceDialog', 'hotDiceCancel');
      }, 200);
    }
  });
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
  let resultText = 'FARKLE';
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
        if (isStraight == true || isAllPairs) {
          enableDiceHold(diceArr[i]);
          scoringDiceExists = true;
          diceArr[i].allDiceWorth = 30 * currentBet;
        } else if (diceArr[i].numValue == 1 || diceArr[i].numValue == 5) {
          enableDiceHold(diceArr[i]);
          scoringDiceExists = true;
          if (diceArr[i].numValue == 1) {
            diceArr[i].singleDiceWorth = 2 * currentBet;
          } else {
            diceArr[i].singleDiceWorth = 1 * currentBet;
          }
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
      if ((diceArr[i].numValue == 5 && diceArr[i].sameKindCount > 2) || (diceArr[i].numValue == 1 && diceArr[i].sameKindCount > 3)) {
        console.log('already counted as a group');
      } else {
        score = score + diceArr[i].singleDiceWorth;
      }
    }
  }
  return score;
}

function saveCurrentRollScore() {
  let score = 0;
  if (diceRolls > 0) {
    let multipleDiceScored = false;
    let fivesHeld = 0, onesHeld = 0;
    let fivesScore = 0, onesScore = 0;
    for (let i = diceHeldThisRoll; i < diceArr.length && i < 6; i++) {
      if (diceArr[i].allDiceWorth != 0 && multipleDiceScored == false) {
        score = score + diceArr[i].allDiceWorth;
        multipleDiceScored = true;
      } else if (diceArr[i].multipleDiceWorth != 0 && multipleDiceScored == false) {
        if (diceArr[i].numValue == 5) {
          fivesHeld++; //detecting how many held
          fivesScore = diceArr[i].multipleDiceWorth; //remember score of combo
        } else if (diceArr[i].numValue == 1) {
          onesHeld++; //detecting how many held
          onesScore = diceArr[i].multipleDiceWorth; //remember score of combo
        } else {
          score = score + diceArr[i].multipleDiceWorth;
          multipleDiceScored = true;
        }
      } else if (diceArr[i].singleDiceWorth != 0) {
        if ((diceArr[i].numValue == 5 && diceArr[i].sameKindCount > 2) || (diceArr[i].numValue == 1 && diceArr[i].sameKindCount > 3)) {
          console.log('already counted as a group');
        } else {
          score = score + diceArr[i].singleDiceWorth;
        }
      }
    }
    if (fivesHeld > 2) {
      score = score + fivesScore;
    } else if (onesHeld > 3) {
      score = score + onesScore;
    }
    const span1 = document.createElement('span'), span2 = document.createElement('span');
    span1.className = 'md-text farkle-turn-tally'; span2.className = 'turn-score roll-score md-text farkle-turn-tally';
    rollScoreDiv.appendChild(span1);
    rollScoreDiv.appendChild(span2);
    span1.innerText = document.getElementsByClassName('turn-score').length + ': ';
    span2.innerHTML = score + '<br>';
    rollScoreDiv.style.display = 'block';
  }
  return score;
}

function saveTotalScore() {
  if (diceRolls == 1) {
    totalScoreDiv.style.display = 'block';
  }
  totalScoreText.innerText = totalScore;
}

function endCasualTurn() {
  totalScore = parseInt(rollScoreHeading.innerText) + totalScore;
  endCasualTurnConfirm();
  document.getElementById('endTurnPopupSpan').innerText = totalScore;
}

function endTurn() {
  totalScore = parseInt(rollScoreHeading.innerText) + totalScore;
  endTurnConfirm();
  document.getElementById('number-coins-won').innerText = ' ' + totalScore + ' ';
}

function endTurnConfirm() {
  const dialog = document.getElementById('confirmDialog');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    setTimeout(function() {dialog.close()}, 20000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('confirmButton').onclick = function() {
    dialog.close();
    endTurnDialog();
  }
}

function endCasualTurnConfirm() {
  const dialog = document.getElementById('confirmDialog');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    setTimeout(function() {dialog.close()}, 20000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('confirmButton').onclick = function() {
    dialog.close();
    endCasualTurnDialog();
  }
}

function endTurnDialog() {
  winButton.style.backgroundColor = 'darkblue';
  winButton.style.boxShadow = '0 6px var(--darkerblue)';
  updateCoinsEnd = new Promise(function(resolve, reject) {
    totalCoins = totalCoins + totalScore;
    currentWinSpan.innerText = totalScore;
    totalCoinsSpan.innerText = totalCoins;
    resolve(5);
  });
  updateStoredCoins(updateCoinsEnd);
  const dialog = document.getElementById('endTurnDialog');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    setTimeout(function() {dialog.close(); window.location.reload();}, 10000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('endTurnCancel').onclick = function() {
    dialog.close();
    window.location.reload();
  }
}

function endCasualTurnDialog() {
  const dialog = document.getElementById('endTurnDialog');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    setTimeout(function() {dialog.close(); window.location.reload();}, 10000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('endTurnCancel').onclick = function() {
    dialog.close();
    window.location.reload();
  }
}

function displayFarkleDialog(dialog, cancel) {
  const curDialog = document.getElementById(dialog);
  if (typeof curDialog.showModal === 'function') {
    curDialog.showModal();
    setTimeout(function() {curDialog.close();}, 8000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById(cancel).onclick = function() {
    curDialog.close();
  }
}

function disableDiceHold(...args) {
  args.forEach(function(element) {
    element.canHold = false;
    element.diceElement.classList.remove('interactive-img');
    element.diceElement.parentElement.removeAttribute('onclick');
  });
}

function enableDiceHold(...args) {
  args.forEach(function(element) {
    element.canHold = true;
    let holdId = element.diceElement.parentElement.childNodes[1].getAttribute('id');
    element.diceElement.classList.add('interactive-img');
    element.diceElement.parentElement.setAttribute('onclick', "toggleDiceHold('" + holdId + "')");
  });
}

function toggleDiceHold(currentHoldElement) {
  const holdElement = document.getElementById(currentHoldElement);
  const diceNum = parseInt(currentHoldElement.replace(/hold/, ''));
  if (!diceArr[diceNum].isHeld) {
    if ((diceArr[diceNum].multipleDiceWorth != 0 || diceArr[diceNum].allDiceWorth) != 0 && diceArr[diceNum].numValue != 5 && diceArr[diceNum].numValue != 1) {
      for (let i = 0 + diceHeld; i < 6; i++) {
        if (diceArr[i].multipleDiceWorth != 0 || diceArr[i].allDiceWorth != 0) {
          diceArr[i].isHeld = true;
          document.getElementById('hold' + i).classList.remove('text-opacity');
        }
      }
    } else {
      diceArr[diceNum].isHeld = true;
      holdElement.classList.remove('text-opacity');
    }
    diceArr[diceNum].isHeld = true;
  } else {
    if ((diceArr[diceNum].multipleDiceWorth != 0 && diceArr[diceNum].numValue != 5 && diceArr[diceNum].numValue != 1) || diceArr[diceNum].allDiceWorth != 0) {
      for (let i = 0 + diceHeld; i < 6; i++) {
        if (diceArr[i].multipleDiceWorth != 0 || diceArr[i].allDiceWorth != 0) {
          if (diceArr[i].numValue != 5 || diceArr[i].numValue != 1) {
            diceArr[i].isHeld = false;
            document.getElementById('hold' + i).classList.add('text-opacity');
          }
        }
      }
    } else {
      diceArr[diceNum].isHeld = false;
      holdElement.classList.add('text-opacity');
    }
  }
}

function toggleBet() {
  if (diceRolls === 0) {
    if (totalCoins - currentCoinsBet <= 0) {
      currentCoinsBet = 10;
    } else if (currentCoinsBet < 50) {
      currentCoinsBet = currentCoinsBet + 10;
    } else {
      currentCoinsBet = 10;
    }
    currentBetSpan.innerText = currentCoinsBet;
  }
}

function outOfCoinsDialog() {
  const outOfCoinsDialog = document.getElementById('outOfCoinsDialog');
  if (typeof outOfCoinsDialog.showModal === 'function') {
    outOfCoinsDialog.showModal();
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('outOfCoinsCancel').onclick = function() {
    outOfCoinsDialog.close();
  }
  diceRollButton.disabled = false;
}

function updateStoredCoins(updateCoins) {
  updateCoins.then(function() {
    if (totalCoins != parseInt(coinsInput.value)) {
      coinsInput.value = totalCoins;
    } else {
      return false;
    }
    document.getElementById('currentWinInput').value = totalScore;
    document.getElementById('farkleForm').submit();
  });
}