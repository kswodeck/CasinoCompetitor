import {outOfCoinsDialog, updateStoredCoins} from './games.js';
var diceArr = [];
var holdArr = [];
var diceRolls = 0, diceHeld = 0, diceHeldThisRoll = 0, heldDiceScore = 0, totalScore = 0;
var currentBet = 50, currentCoinsBet = 0;
var hotDice = false, isSetup = false;
var players = 1, curPlayer = 1;
const diceRollButton = document.getElementById('farkle-roll-button');
const farkleEndButton = document.getElementById('farkle-end-button');
const rollRankingHeading = document.getElementById('roll-ranking-heading');
const rollScoreHeading = document.getElementById('roll-score-heading');
const rollScoreDiv = document.getElementById('farkle-roll-score-div');
const totalScoreDiv = document.getElementById('farkle-total-score-div');
const totalScoreText = document.getElementById('total-score-text');
const pageHeading = document.getElementById('page-heading');
if (pageHeading.innerText == 'COMPETITIVE FARKLE') {
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
    diceRollButton.disabled = true;
  }
} else {
  var quanityDiv = document.getElementById('player-quantity-input-div');
}

function farkleRoll() {
  diceRollButton.disabled = true;
  currentBet = parseInt(currentBetSpan.innerText) / 10;
  if ((totalCoins < 10 || !totalCoinsNum) && diceRolls === 0) {
    outOfCoinsDialog();
    return false;
  }
  currentWinSpan.innerText = 0;
  betButton.disabled = true;
  winButton.style.backgroundColor = '#be0b2f';
  winButton.style.boxShadow = '0 6px var(--darkcrimson)';
  if (diceRolls === 0) {
    updateCoinsStart = new Promise(resolve => {
      totalCoins = totalCoins - currentCoinsBet;
      totalCoinsSpan.innerText = totalCoins;
      resolve(5);
    });
    updateStoredCoins(updateCoinsStart, totalCoins, totalScore);
  }
  let continueRoll = farkleRollSetup();
  if (!continueRoll) {
    return;
  }
  diceRoll();
  farkleRollTeardown();
}

function casualFarkleRoll() {
  quanityDiv.style.display = "none";
  players = parseInt(document.getElementById('playerquantity').value);
  if (players > 10) {
    players = 10;
  }
  if (players > 1 && isSetup == false) {
    setupMultiPlayerGame(players);
    return;
  } else {
    isSetup = true;
  }
  diceRollButton.disabled = true;
  let continueRoll = farkleRollSetup();
  if (!continueRoll) {
    return;
  }
  diceRoll();
  farkleRollTeardown();
  function setupMultiPlayerGame (players) {
    let choosePlayersDiv = document.getElementById('multiPlayerSetupDiv');
    for (let i = 0; i < players; i++) {
      let numPlayer = i+1;
      const input = document.createElement('input');
      const pageBreak = document.createElement('br');
      input.type = 'text';
      input.minLength = "1";
      input.maxLength = "30";
      input.size = "30";
      input.name = "player" + numPlayer;
      input.placeholder = "Player " + numPlayer;
      input.autocomplete = "off";
      input.setAttribute("class", "sm-text farkle-player-input user-input");
      choosePlayersDiv.appendChild(input);
      choosePlayersDiv.appendChild(pageBreak);
    }
    const dialog = document.getElementById('multiPlayerSetupDialog');
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      if (document.getElementsByClassName('backdrop')[0]) {
        dialog.style.cssText = '';
        document.getElementsByClassName('backdrop')[0].style.cssText = '';
      }
    } else {
      console.log('The <dialog> API is not supported by this browser');
    }
    document.getElementById('multiPlayerSetupConfirm').onclick = () => {
      submitGameSetup('multiPlayerSetupDialog');
    };
  }
}
function diceRoll() {
  for (var currentDice = 0 + diceHeld; currentDice < 6; currentDice++) {
    let currentDiceElement = document.getElementsByClassName('dice')[currentDice];
    let holdCurrentDice = document.getElementById('hold' + currentDice);
    currentDiceElement.style.visibility = 'visible';
    currentDiceElement.classList.remove('spin-grow');
    holdCurrentDice.classList.add('text-opacity');
    diceArr.push(new Dice(roll(), currentDiceElement));
    setTimeout(() => animateDice(currentDiceElement), 30);
    currentDiceElement.src = diceArr[currentDice].imgSrc;
  }
}

class Dice {
  constructor(numValue, currentDice) {
    this.numValue = numValue;
    this.imgSrc = 'images/' + numValue + 'dice.webp';
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
      diceRollButton.disabled = false;
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
    farkleEndButton.disabled = false;
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
    farkleEndButton.disabled = false;
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
      rollRankingHeading.style.color = '#be0b2f';
      if (players > 1) {
        diceRollButton.innerText = 'Show Scores';
      } else {
        diceRollButton.innerText = 'Play Again';
      }
      farkleEndButton.disabled = true;
      diceRollButton.onclick = () => {
        if (players == 1) {
        window.location.reload();
        } else {
          setUpTeardownMultiPlayers();
        }
      };
      totalScoreText.innerText = 0;
      rollScoreHeading.style.display = 'none';
      displayFarkleDialog('farkleDialog', 'farkleCancel');
      totalScore = 0;
    } else {
      rollRankingHeading.style.color = 'darkblue';
      diceRollButton.innerText = 'Roll Again';
      if (hotDice && rollRankingHeading.innerText === 'Scoring Dice Rolled') {
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
  new Promise(resolve => {
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
      setTimeout(() => displayFarkleDialog('hotDiceDialog', 'hotDiceCancel'), 200);
    }
  });
  setTimeout(() => diceRollButton.disabled = false, 400);
}

var roll = () => Math.floor((Math.random() * 6) + 1);
var animateDice = (diceElement) => diceElement.classList.add('spin-grow');

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
          curDice.allDiceWorth = 30 * currentBet;
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
          curDice.allDiceWorth = 50 * currentBet;
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
          curDice.allDiceWorth = 60 * currentBet;
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
    span1.className = 'turn-count md-text farkle-turn-tally', span2.className = 'turn-score roll-score md-text farkle-turn-tally';
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

function submitGameSetup(dialog) {
  document.getElementById(dialog).close();
  isSetup = true;
  diceRollButton.innerText = "Roll Dice";
  let playerScoresDiv = document.getElementById('multiPlayerScoreDiv');
  for (let i = 0; i < players; i++) {
    const playerSpan = document.createElement('span');
    const scoreSpan = document.createElement('span');
    const lineBreak = document.createElement('br');
    let nthPlayer = document.getElementsByClassName('farkle-player-input')[i];
    let playerNum = i+1;
    if (!nthPlayer.value) {
      nthPlayer.value = "Player " + playerNum;
    }
    playerSpan.setAttribute("class", "sm-text farkle-player");
    if (i==1) {
      playerSpan.classList.add('blue-text');
    }
    scoreSpan.setAttribute("class", "sm-text blue-text farkle-player-score");
    scoreSpan.innerText = '0';
    playerSpan.innerText = nthPlayer.value + ":";
    playerScoresDiv.appendChild(playerSpan);
    playerScoresDiv.appendChild(scoreSpan);
    playerScoresDiv.appendChild(lineBreak);
  }
  pageHeading.innerText = document.getElementsByClassName('farkle-player-input')[0].value + "'s Turn";
  diceRollButton.disabled = false;
}

function setUpTeardownMultiPlayers() {
  diceRollButton.onclick = () => casualFarkleRoll();
  let curPlayScore = document.getElementsByClassName('farkle-player-score')[curPlayer-1];
  curPlayScore.innerText = parseInt(curPlayScore.innerText) + totalScore;
  var dialog = document.getElementById('multiPlayerScoreDialog');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      dialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('multiPlayerScoreContinue').onclick = () => {
    nextPlayer();
    dialog.close();
    diceRollButton.disabled = false;
  };
}

function nextPlayer() {
  let prevPlayer = curPlayer;
  if (curPlayer == players) {
    curPlayer = 1;
    document.getElementsByClassName('farkle-player')[curPlayer].classList.add('blue-text');
    document.getElementsByClassName('farkle-player')[0].classList.remove('blue-text');
  } else {
    curPlayer++;
    if (curPlayer == players) {
      document.getElementsByClassName('farkle-player')[0].classList.add('blue-text');
    } else {
      document.getElementsByClassName('farkle-player')[curPlayer].classList.add('blue-text');
    }
    document.getElementsByClassName('farkle-player')[prevPlayer].classList.remove('blue-text');
  }
  resetRoll();
}

function resetRoll() {
  diceArr = [];
  diceRolls = 0, diceHeld = 0, diceHeldThisRoll = 0, heldDiceScore = 0, totalScore = 0;
  diceRollButton.innerText = "Roll Dice";
  farkleEndButton.disabled = true;
  pageHeading.innerText = document.getElementsByClassName('farkle-player-input')[curPlayer-1].value + "'s Turn";
  for (let i = 0; i < 6; i++) {
    document.getElementsByClassName('dice')[i].src = '';
    document.getElementsByClassName('hold-dice-text')[i].setAttribute('class', 'hold-dice-text text-opacity');
  }
  for (let i = 0; i < document.getElementsByClassName('turn-score').length; i++) {
    document.getElementsByClassName('turn-score')[i].remove();
    document.getElementsByClassName('turn-count')[i].remove();
  }
  rollScoreHeading.style.display = 'none';
  rollScoreDiv.style.display = 'none';
  totalScoreDiv.style.display = 'none';
  rollRankingHeading.innerText = '';
  rollScoreHeading.innerText = 0;
  totalScoreText.innerText = 0;
}

function endGameConfirm() {
  const dialog = document.getElementById('endGameConfirmDialog');
  const multiPlayDialog = document.getElementById('multiPlayerScoreDialog');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    multiPlayDialog.close();
    if (document.getElementsByClassName('backdrop')[0]) {
      dialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('endGameConfirmButton').onclick = () => {
    document.getElementById('endGameConfirmDialog').close();
    displayMultiPlayerWinner();
  };
  document.getElementById('endGameCancelButton').onclick = () => {
    document.getElementById('endGameConfirmDialog').close();
    multiPlayDialog.showModal();
  };
}

function displayMultiPlayerWinner() {
  let winningPlayer = getMultiPlayerWinner();
  document.getElementById('multiPlayerWinnerSpan').innerText = document.getElementsByClassName('farkle-player-input')[winningPlayer].value + " wins!";
  document.getElementById('winnerScoreTotal').innerText = document.getElementsByClassName('farkle-player-score')[winningPlayer].innerText;
  const dialog = document.getElementById('multiPlayerWinnerDialog');
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      dialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
      setTimeout(() => window.location.reload(), 60000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('winnerCancel').onclick = () => {
    window.location.reload();
  };
}

function getMultiPlayerWinner () {
  let highestScore = parseInt(document.getElementsByClassName('farkle-player-score')[0]);
  let highestPosition = 0;
  for (let i = 1; i < players; i++) {
    let playerScore = parseInt(document.getElementsByClassName('farkle-player-score')[i]);
    if (playerScore > highestScore) {
      highestScore = playerScore;
      highestPosition = i;
    }
  }
  return highestPosition;
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
    var curTimeout = setTimeout(() => dialog.close(), 20000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('confirmButton').onclick = () => {
    dialog.close();
    endTurnDialog();
    clearTimeout(curTimeout);
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
      var curTimeout = setTimeout(() => dialog.close(), 15000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('confirmButton').onclick = () => {
    dialog.close();
    endCasualTurnDialog();
    clearTimeout(curTimeout);
  };
}

function endTurnDialog() {
  winButton.style.backgroundColor = 'darkblue';
  winButton.style.boxShadow = '0 6px var(--darkerblue)';
  updateCoinsEnd = new Promise(resolve => {
    totalCoins = totalCoins + totalScore;
    currentWinSpan.innerText = totalScore;
    totalCoinsSpan.innerText = totalCoins;
    resolve(5);
  });
  updateStoredCoins(updateCoinsEnd, totalCoins, totalScore);
  const dialog = document.getElementById('endTurnDialog');
  diceRollButton.disabled = true;
  farkleEndButton.disabled = true;
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      dialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
    document.getElementById('endTurnCancel').onclick = () => window.location.reload();
    setTimeout(() => window.location.reload(), 8000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
}

function endCasualTurnDialog() {
  const dialog = document.getElementById('endTurnDialog');
  diceRollButton.disabled = true;
  farkleEndButton.disabled = true;
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
    if (document.getElementsByClassName('backdrop')[0]) {
      dialog.style.cssText = '';
      document.getElementsByClassName('backdrop')[0].style.cssText = '';
    }
    var curTimeout = setTimeout(() => {
      if (players == 1) {
        window.location.reload();
      } else {
        dialog.close();
        setUpTeardownMultiPlayers();
      }
    }, 7000);
    document.getElementById('endTurnCancel').onclick = () => {
      if (players == 1) {
      window.location.reload();
      } else {
        clearTimeout(curTimeout);
        dialog.close();
        setUpTeardownMultiPlayers();
      }
    };
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
    var curTimeout = setTimeout(() => curDialog.close(), 7000);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById(cancel).onclick = () => {
    curDialog.close();
    clearTimeout(curTimeout);
  };
}

function disableDiceHold(...args) {
  args.forEach(dice => {
    dice.canHold = false;
    dice.diceElement.classList.remove('interactive-img');
    dice.diceElement.parentElement.removeAttribute('onclick');
  });
}

function enableDiceHold(...args) {
  args.forEach(dice => {
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

function toggleFarkleBet() {
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

window.toggleFarkleBet = toggleFarkleBet; window.toggleDiceHold = toggleDiceHold;
window.endTurn = endTurn; window.endCasualTurn = endCasualTurn;
window.farkleRoll = farkleRoll; window.casualFarkleRoll = casualFarkleRoll;
window.endGameConfirm = endGameConfirm;