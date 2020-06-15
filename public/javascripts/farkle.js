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
  var totalCoinsNum = parseInt(totalCoinsSpan.innerText);
  var currentBetSpan = document.getElementById('current-bet-span');
  var winButton = document.getElementById('win-button');
  var currentWinSpan = document.getElementById('current-win-span');
  var betButton = document.getElementById('bet-button');
  var totalCoins = totalCoinsSpan.innerText;
  currentCoinsBet = 10;
  currentBet = 1;
  var updateCoinsStart, updateCoinsEnd;
  if (totalCoinsNum < 10 || !totalCoinsNum) {
    outOfCoinsDialog();
  }
}

function farkleRoll() {
  diceRollButton.setAttribute('disabled', 'disabled');
  currentBet = parseInt(currentBetSpan.innerText) / 10;
  if ((totalCoins < 10 || !totalCoinsNum) && diceRolls === 0) {
    outOfCoinsDialog();
    return false;
  }
  currentWinSpan.innerText = 0;
  betButton.disabled = true;
  winButton.style.backgroundColor = 'crimson';
  winButton.style.boxShadow = '0 6px var(--darkcrimson)';
  if (diceRolls === 0) {
    updateCoinsStart = new Promise((resolve) => {
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
  diceRoll();
  farkleRollTeardown();
}

function casualFarkleRoll() {
  diceRollButton.setAttribute('disabled', 'disabled');
  let continueRoll = farkleRollSetup();
  if (continueRoll == false) {
    return;
  }
  diceRoll();
  farkleRollTeardown();
}
function diceRoll() {
  for (var currentDice = 0 + diceHeld; currentDice < 6; currentDice++) {
    let currentDiceElement = document.getElementsByClassName('dice')[currentDice];
    let holdCurrentDice = document.getElementById('hold' + currentDice);
    currentDiceElement.classList.remove('spin-grow');
    holdCurrentDice.classList.add('text-opacity');
    diceArr.push(new Dice(roll(), currentDiceElement));
    setTimeout(() => {animateDice(currentDiceElement);}, 30);
    currentDiceElement.src = diceArr[currentDice].imgSrc;
  }
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
  setTimeout(() => {
    if (rollRankingHeading.innerText == 'Farkle') {
      rollRankingHeading.style.color = 'crimson';
      diceRollButton.innerText = 'Play Again';
      farkleEndButton.setAttribute('disabled', 'disabled');
      diceRollButton.setAttribute('onclick', 'window.location.reload(); return false');
      totalScoreText.innerText = 0;
      rollScoreHeading.style.display = 'none';
      displayFarkleDialog('farkleDialog', 'farkleCancel');
    } else {
      rollRankingHeading.style.color = 'darkblue';
      diceRollButton.innerText = 'Roll Again';
      if (hotDice) {
        rollRankingHeading.innerText = 'Hot Dice';
      }
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
  new Promise((resolve) => {
    for (let curDice = 0; curDice < 6; curDice++) {
      if (diceArr[curDice].canHold) {
        totalDiceCanHold++;
      }
    }
    resolve(5);
  }).then(() => {
    if (totalDiceCanHold >= 6) {
      hotDice = true;
      for (let curDice = 0; curDice < 6; curDice++) {
          diceArr[curDice].isHeld = true;
          disableDiceHold(diceArr[curDice]);
          document.getElementById('hold' + curDice).classList.remove('text-opacity');
      }
      setTimeout(() => {
        displayFarkleDialog('hotDiceDialog', 'hotDiceCancel');
      }, 200);
    }
  });
  setTimeout(() => {diceRollButton.removeAttribute('disabled');}, 400);
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
    if (getQuantityOfNumber(1) == 3) { //if there are 3 ones they are seen like normal scoring dice
      resultText = 'Scoring Dice Rolled';
    } else {
      resultText = '3 of a Kind';
    }
  } else if (isRollScoring) {
    resultText = 'Scoring Dice Rolled';
  }
  return resultText;
  function classifySameKinds() {
    for (var i = 0 + diceHeld; i < 6; i++) {
      let currentKindCount = 1;
      let curDice = diceArr[i];
      for (let j = 5; j >= 0 + diceHeld; j--) {
        if (i != j) {
          if (curDice.numValue == diceArr[j].numValue) {
            currentKindCount++;
          }
        }
      }
      curDice.sameKindCount = currentKindCount;
      if (currentKindCount === 2) {
        curDice.hasPair = true;
      } else if (currentKindCount === 3) {
        curDice.hasTriple = true;
      } else {
        curDice.hasPair = false;
        curDice.hasTriple = false;
      }
    }
    var maxArr = [];
    for (let x = 0 + diceHeld; x < 6; x++) {
      maxArr.push(diceArr[x].sameKindCount);
    }
      let highestMatch = Math.max(...maxArr);
    for (let i = 0 + diceHeld; i < 6; i++) {
      if (highestMatch == 1 && diceHeld == 0) {
        diceArr[i].isStraight = true;
        enableDiceHold(diceArr[i]);
      } else {
        diceArr[i].isStraight = false;
      }
    }
    return highestMatch;
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
  function getQuantityOfNumber(number) {
    let numQuantity = 0;
    diceArr.forEach(dice => {
      if (dice.numValue === number) {
        numQuantity++;
      }
    });
    return numQuantity;
  }
  function classifyDiceWorth(highestSameKind, isAllPairs, isTriplets, isStraight) {
    let scoringDiceExists = false;
    for (let i = 0 + diceHeld; i < 6; i++) {
      var curDice = diceArr[i];
      var diceVal = curDice.numValue, sameCount = curDice.sameKindCount;
      if (highestSameKind < 3) {
        if (isStraight == true || isAllPairs) {
          enableDiceHold(curDice);
          scoringDiceExists = true;
          curDice.allWorth = 30 * currentBet;
        } else if (diceVal == 1 || diceVal == 5) {
          enableDiceHold(curDice);
          scoringDiceExists = true;
          if (diceVal == 1) {
            curDice.singleDiceWorth = 2 * currentBet;
          } else {
            curDice.singleDiceWorth = 1 * currentBet;
          }
        } else {
          disableDiceHold(curDice);
        }
      } else {
        scoringDiceExists = true;
        if (isTriplets) {
          enableDiceHold(curDice);
          curDice.allWorth = 50 * currentBet;
          curDice.multipleDiceWorth = 50 * currentBet;
        } else if (sameCount == 3) {
          enableDiceHold(curDice);
          if (diceVal == 1) {
            curDice.singleDiceWorth = 2 * currentBet;
          } else {
            curDice.multipleDiceWorth = (diceVal * 2) * currentBet;
            if (diceVal == 5) {
              curDice.singleDiceWorth = 1 * currentBet;
            }
          }
        } else if (sameCount == 4) {
          enableDiceHold(curDice);
          curDice.multipleDiceWorth = 20 * currentBet;
        } else if (sameCount == 5) {
          enableDiceHold(curDice);
          curDice.multipleDiceWorth = 40 * currentBet;
        } else if (sameCount == 6) {
          enableDiceHold(curDice);
          curDice.multipleDiceWorth = 60 * currentBet;
          curDice.allWorth = 60 * currentBet;
        } else if (sameCount < 3) {
          if (diceVal == 1) {
            enableDiceHold(curDice);
            curDice.singleDiceWorth = 2 * currentBet;
          } else if (diceVal == 5) {
            enableDiceHold(curDice);
            curDice.singleDiceWorth = 1 * currentBet;
          } else {
            disableDiceHold(curDice);
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
    let diceVal = diceArr[i].numValue, sameCount = diceArr[i].sameKindCount;
    let singleWorth = diceArr[i].singleDiceWorth, multWorth = diceArr[i].multipleDiceWorth, allWorth = diceArr[i].allDiceWorth;
    if (allWorth != 0) {
      return allWorth;
    } else if (multWorth != 0 && multipleDiceScored == false) {
      score = score + multWorth;
      multipleDiceScored = true;
    } else if (singleWorth != 0) {
      if ((diceVal == 5 && sameCount > 2) || (diceVal == 1 && sameCount > 3)) {
        console.log('already counted as a group');
      } else {
        score = score + singleWorth;
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
      let diceVal = diceArr[i].numValue, sameCount = diceArr[i].sameKindCount;
      let singleWorth = diceArr[i].singleDiceWorth, multWorth = diceArr[i].multipleDiceWorth, allWorth = diceArr[i].allDiceWorth;
      if (allWorth != 0 && multipleDiceScored == false) {
        score = score + allWorth;
        multipleDiceScored = true;
      } else if (multWorth != 0 && multipleDiceScored == false) {
        if (diceVal == 5) {
          fivesHeld++; //detecting how many fives held
          fivesScore = multWorth; //save score of fives combo
        } else if (diceVal == 1) {
          onesHeld++; //detecting how many ones held
          onesScore = multWorth; //save score of ones combo
        } else {
          score = score + multWorth;
          multipleDiceScored = true;
        }
      } else if (singleWorth != 0) {
        if ((diceVal == 5 && sameCount > 2) || (diceVal == 1 && sameCount > 3)) {
          console.log('will count single scoring dice as a group');
        } else {
          score = score + singleWorth;
        }
      }
    }
    if (fivesHeld > 2) {
      score = score + fivesScore;
    } else if (onesHeld > 3) {
      score = score + onesScore;
    }
    const span1 = document.createElement('span'), span2 = document.createElement('span');
    span1.className = 'md-text farkle-turn-tally', span2.className = 'turn-score roll-score md-text farkle-turn-tally';
    rollScoreDiv.appendChild(span1), rollScoreDiv.appendChild(span2);
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
  document.getElementById('number-coins-won').innerText = totalScore + ' ';
}

function endTurnConfirm() {
  const dialog = document.getElementById('confirmDialog');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      dialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
    setTimeout(() => {dialog.close();}, 20000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('confirmButton').onclick = () => {
    dialog.close();
    endTurnDialog();
  };
}

function endCasualTurnConfirm() {
  const dialog = document.getElementById('confirmDialog');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      dialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
      setTimeout(() => {dialog.close();}, 15000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('confirmButton').onclick = () => {
    dialog.close();
    endCasualTurnDialog();
  };
}

function endTurnDialog() {
  winButton.style.backgroundColor = 'darkblue';
  winButton.style.boxShadow = '0 6px var(--darkerblue)';
  updateCoinsEnd = new Promise((resolve) => {
    totalCoins = totalCoins + totalScore;
    currentWinSpan.innerText = totalScore;
    totalCoinsSpan.innerText = totalCoins;
    resolve(5);
  });
  updateStoredCoins(updateCoinsEnd);
  const dialog = document.getElementById('endTurnDialog');
  diceRollButton.setAttribute('disabled', 'disabled');
  farkleEndButton.setAttribute('disabled', 'disabled');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      dialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
    document.getElementById('endTurnCancel').onclick = () => {
      window.location.reload();
    };
    setTimeout(() => {window.location.reload();}, 8000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
}

function endCasualTurnDialog() {
  const dialog = document.getElementById('endTurnDialog');
  diceRollButton.setAttribute('disabled', 'disabled');
  farkleEndButton.setAttribute('disabled', 'disabled');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      dialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
    document.getElementById('endTurnCancel').onclick = () => {
      window.location.reload();
    };
    setTimeout(() => {window.location.reload();}, 7000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
}

function displayFarkleDialog(dialog, cancel) {
  const curDialog = document.getElementById(dialog);
  if (typeof curDialog.showModal === 'function') {
    curDialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      curDialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
    setTimeout(() => {curDialog.close();}, 7000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById(cancel).onclick = () => {
    curDialog.close();
  };
}

function disableDiceHold(...args) {
  args.forEach((dice) => {
    dice.canHold = false;
    dice.diceElement.classList.remove('interactive-img');
    dice.diceElement.parentElement.removeAttribute('onclick');
  });
}

function enableDiceHold(...args) {
  args.forEach((dice) => {
    dice.canHold = true;
    let holdId = dice.diceElement.parentElement.childNodes[1].getAttribute('id');
    dice.diceElement.classList.add('interactive-img');
    dice.diceElement.parentElement.setAttribute('onclick', "toggleDiceHold('" + holdId + "')");
  });
}

function toggleDiceHold(currentHoldElement) {
  const holdElement = document.getElementById(currentHoldElement);
  const diceNum = parseInt(currentHoldElement.replace(/hold/, ''));
  let curDice = diceArr[diceNum];
  if (!curDice.isHeld) {
    if ((curDice.multipleDiceWorth != 0 || curDice.allDiceWorth) != 0 && curDice.numValue != 5 && curDice.numValue != 1) {
      for (let i = 0 + diceHeld; i < 6; i++) {
        let relDice = diceArr[i];
        if (relDice.multipleDiceWorth != 0 || relDice.allDiceWorth != 0) {
          relDice.isHeld = true;
          document.getElementById('hold' + i).classList.remove('text-opacity');
        }
      }
    } else {
      curDice.isHeld = true;
      holdElement.classList.remove('text-opacity');
    }
  } else {
    if ((curDice.multipleDiceWorth != 0 || curDice.allDiceWorth) != 0 && curDice.numValue != 5 && curDice.numValue != 1) {
      for (let i = 0 + diceHeld; i < 6; i++) {
        let relDice = diceArr[i];
        if (relDice.multipleDiceWorth != 0 || relDice.allDiceWorth != 0) {
          if (relDice.numValue != 5 || relDice.numValue != 1) {
            relDice.isHeld = false;
            document.getElementById('hold' + i).classList.add('text-opacity');
          }
        }
      }
    } else {
      curDice.isHeld = false;
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
    if (document.getElementsByClassName('backdrop')[0]) {
      outOfCoinsDialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('outOfCoinsCancel').onclick = () => {
    outOfCoinsDialog.close();
  };
  diceRollButton.disabled = false;
}

function updateStoredCoins(updateCoins) {
  updateCoins.then(() => {
    let curWin;
    diceRolls > 0 ? curWin = totalScore : curWin = 0;
    let updateData = {coins: totalCoins, currentWin: curWin};
    fetch('/cards', {
      method: 'PUT',
      body: JSON.stringify(updateData),
      headers: {'Content-Type': 'application/json'}
    })
    .then((res) => {
      if (!res.ok) {
        throw Error(res.status);
      }
    })
    .then(res => res)
    .catch((err) => {
      console.error(err);
    });
  });
}