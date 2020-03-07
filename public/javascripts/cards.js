/* eslint-disable semi */
// eslint-disable no-unused-vars
var handsDealt = 0;
var cards = [];
var cards2 = [];
var currentHand = 0;
var mainContainer = new Vue({
  el: '#main-container',
  data: {
    totalCoins: 100,
    currentBet: 1,
    currentWin: 0,
    dealButtonText: 'Deal Cards',
    resultText: 'Game Over',
  }
})
document.getElementById('card-deal-button').style.visibility = 'visible';
// const totalCoinsSpan = document.getElementById('total-coins-span');
const currentBetSpan = document.getElementById('current-bet-span');
const oddsDiv = document.getElementById('hand-odds-div');
const showHideOddsButton = document.getElementById('show-hide-odds-button');
const cardDealButton = document.getElementById('card-deal-button');
const handRankingHeading = document.getElementById('hand-ranking-heading');
if (document.getElementById("current-link").innerText === 'Competitive') {
    document.getElementById('total-coins-span').style.visibility = 'visible';
    document.getElementById('current-bet-span').style.visibility = 'visible';
    document.getElementById('current-win-span').style.visibility = 'visible';
  }

function getCards() {
  if (mainContainer.totalCoins <= 0 && handsDealt === 0) {
    outOfCoinsDialog();
    handsDealt = 2;
  }
  const winButton = document.getElementById('win-button');
  // const currentWinSpan = document.getElementById('current-win-span');
  const betButton = document.getElementById('bet-button');
  cardDealButton.disabled = true;
  // currentWinSpan.innerText = 0;
  handRankingHeading.style.display = 'none';
  winButton.style.backgroundColor = 'crimson';
  for (let currentCard = 0; currentCard < 5; currentCard++) {
    let holdCurrentCard = document.getElementById('hold' + currentCard);
    var currentValues = [];
    if (handsDealt === 0) {
      currentHand = getFirstHand(currentCard,holdCurrentCard,currentValues);
      document.getElementsByClassName('cards')[currentCard].src = cards[currentCard].imgSrc;
      betButton.disabled = true;
    } else if (handsDealt === 1) {
      currentHand = getSecondHand(currentCard, holdCurrentCard, currentValues);
      if (currentCard === 4) {
        cards = [];
        cards2 = [];
        handRankingHeading.style.display = 'block';
      }
    } else {
      lastHandTeardown(holdCurrentCard,currentCard,cardDealButton);
      betButton.disabled = false;
    }
  }
  if (handsDealt === 0) {
    mainContainer.totalCoins = mainContainer.totalCoins - mainContainer.currentBet;
    // totalCoinsSpan.innerText = totalCoins;
  }
  getGameResults(handsDealt, handRankingHeading, cardDealButton, collectCoins);
  if (handsDealt === 2) {
    handsDealt = 0;
  }
  else {
    handsDealt++;
  }
  if (mainContainer.totalCoins - mainContainer.currentBet < 0 && handsDealt === 0) {
    while (mainContainer.totalCoins - mainContainer.currentBet < 0 && mainContainer.currentBet !== 1) {
      mainContainer.currentBet--;
    }
    if (mainContainer.currentBet == 1) {
      betButton.disabled = true;
    }
    // currentBetSpan.innerText = currentBet;
  }
  // if (mainContainer.mainContainer.totalCoins - currentBet < 0 && handsDealt !== 1 && handsDealt !== 2) {
  //   while (mainContainer.mainContainer.totalCoins - currentBet < 0 && currentBet !== 1) {
  //     currentBet--;
  //   }
  //   currentBetSpan.innerText = currentBet;
  // }
  function collectCoins() {
    if (mainContainer.resultText === 'Jacks or Better') {
      mainContainer.currentWin = mainContainer.currentBet;
    } else if (mainContainer.resultText === 'Two Pair') {
      mainContainer.currentWin = mainContainer.currentBet * 2;
    } else if (mainContainer.resultText === '3 of a Kind') {
      mainContainer.currentWin = mainContainer.currentBet * 3;
    } else if (mainContainer.resultText === 'Straight') {
      mainContainer.currentWin = mainContainer.currentBet * 4;
    } else if (mainContainer.resultText === 'Flush') {
      mainContainer.currentWin = mainContainer.currentBet * 6;
    } else if (mainContainer.resultText === 'Full House') {
      mainContainer.currentWin = mainContainer.currentBet * 9;
    } else if (mainContainer.resultText === '4 of a Kind') {
      mainContainer.currentWin = mainContainer.currentBet * 25;
    } else if (mainContainer.resultText === 'Straight Flush') {
      mainContainer.currentWin = mainContainer.currentBet * 50;
    } else if (mainContainer.resultText === 'Royal Flush') {
      if (mainContainer.currentBet < 5) {
        mainContainer.currentWin = mainContainer.currentBet * 250;
      } else {
        mainContainer.currentWin = 4000;
      }
    }
    mainContainer.totalCoins = mainContainer.totalCoins + mainContainer.currentWin;
    winButton.style.backgroundColor = 'darkblue';
    // totalCoinsSpan.innerText = totalCoins;
    winCoinsDialog();
  }
}

function getPracticeCards() {
  cardDealButton.disabled = true;
  handRankingHeading.style.display = 'none';
  for (let currentCard = 0; currentCard < 5; currentCard++) {
    let holdCurrentCard = document.getElementById('hold' + currentCard);
    let currentValues = [];
    if (handsDealt === 0) {
      currentHand = getFirstHand(currentCard,holdCurrentCard,currentValues);
      oddsDiv.style.display = 'none';
      showHideOddsButton.style.display = 'none';
    } else if (handsDealt === 1) {
      currentHand = getSecondHand(currentCard, holdCurrentCard, currentValues);
      if (currentCard === 4) {
        cards = [];
        cards2 = [];
        handRankingHeading.style.display = 'block';
      }
    } else {
      lastHandTeardown(holdCurrentCard, currentCard, cardDealButton);
      if (showHideOddsButton.innerText === 'Hide Odds') {
        oddsDiv.style.display = 'block';
      }
      showHideOddsButton.style.display = 'inline-block';
    }
  }
  getGameResults(handsDealt, handRankingHeading, cardDealButton, winHandDialog);
  if (handsDealt === 2) {
    handsDealt = 0;
  }
  else {
    handsDealt++;
  }
}

function getRandomCardValues() { //  for calculating the values of each card
  const currentValues = [Math.floor((Math.random() * 13) + 1), Math.floor((Math.random() * 4) + 1)];
  const numValue = currentValues[0]; //  13 card value options excluding jokers. 1=ace, 11=jack, 12=queen, 13=king
  const numSuit = currentValues[1]; //  4 card suit options excluding jokers. club,diamond,heart,spade
  currentValues.push(numValue + '-' + numSuit);
  return currentValues;
}
class Card {
  constructor(numValue, numSuit, identity) {
    this.numValue = numValue;
    this.numSuit = numSuit;
    this.identity = identity;
    this.imgSrc = 'images/cards/' + this.identity + '.png';
    this.isRoyal = isRoyal(this.numValue);
    this.isJackOrBetter = isJackOrBetter(this.numValue);
    this.isHeld = false;
    function isRoyal(value) {
      if (value === 1 || value === 10 || value === 11 || value === 12 || value === 13) {
        return true;
      } else {
        return false;
      }
    }
    function isJackOrBetter(value) {
      if (value === 1 || value === 11 || value === 12 || value === 13) {
        return true;
      } else {
        return false;
      }
    }
  }
}

function getFirstHand(currentCard,holdCurrentCard,currentValues) {
      holdCurrentCard.classList.add('text-opacity');
      let isSameIdentity = true;
      while (isSameIdentity === true) {
        currentValues = getRandomCardValues();
        if (cards.filter(x => (x.identity === currentValues[2])).length === 0 || currentCard === 0) {
          isSameIdentity = false;
        }
      }
      cards.push(new Card(currentValues[0], currentValues[1], currentValues[2]));
      document.getElementsByClassName('cards')[currentCard].src = cards[currentCard].imgSrc;
      return cards;
}

function getSecondHand(currentCard,holdCurrentCard,currentValues) {
  holdCurrentCard.classList.add('text-opacity');
  let isSameIdentity = true;
  while (isSameIdentity === true) {
    currentValues = getRandomCardValues();
    if (cards.filter(x => (x.identity === currentValues[2])).length === 0) {
      if (currentCard === 0) {
        isSameIdentity = false;
      } else if (cards2.filter(y => (y.identity === currentValues[2])).length === 0) {
        isSameIdentity = false;
      }
    }
  }
  if (cards[currentCard].isHeld === true) {
    cards2.push(new Card(cards[currentCard].numValue, cards[currentCard].numSuit, cards[currentCard].identity));
  } else {
    cards2.push(new Card(currentValues[0], currentValues[1], currentValues[2]));
  }
  document.getElementsByClassName('cards')[currentCard].src = cards2[currentCard].imgSrc;
  // cardDealButton.innerText = 'Play Again';
  mainContainer.dealButtonText = 'Play Again';
  return cards2;
}

function lastHandTeardown(holdCurrentCard,currentCard) {
  holdCurrentCard.classList.add('text-opacity');
  document.getElementsByClassName('cards')[currentCard].src = 'images/cards/card_standard_blue_back.png';
  // cardDealButton.innerText = 'Deal Cards';
  mainContainer.dealButtonText = 'Deal Cards';
}

function getGameResults(handsDealt, handRankingHeading, cardDealButton, winFunction){
  if (handsDealt < 2) {
    mainContainer.resultText = getHandRanking(currentHand);
    // handRankingHeading.innerText = resultText;
    if (mainContainer.resultText === 'Game Over') {
      handRankingHeading.style.color = 'crimson'; // if no hand category has been acheived, red text
    } else {
      handRankingHeading.style.display = 'block';
      handRankingHeading.style.color = 'darkblue'; // if a hand category has been acheived, blue text
      if (handsDealt === 1) {
        winFunction();
      }
    }
  }
  cardDealButton.disabled = false;
}

function getHandRanking(hand) {
  let resultText = 'Game Over';
  const highestSameKindCount = classifySameKinds(hand);
  const isFlush = isFlushHand(hand);
  const isRoyal = isRoyalHand(hand);
  const isStraight = isStraightHand(hand[0].numValue, hand[1].numValue, hand[2].numValue, hand[3].numValue, hand[4].numValue);
  // let result = 'Game Over';
  if (isTwoPairHand(hand) === true) {
    resultText = 'Two Pair';
  } else if (isJackOrBetterHand(hand) === true && highestSameKindCount === 2) {
    resultText = 'Jacks or Better';
  } else if (highestSameKindCount === 3) {
    if (pairExists(hand) === true) {
      resultText = 'Full House';
    } else {
      resultText = '3 of a Kind';
    }
  } else if (isStraight === true && isFlush === false) { // normal straight, not a royal straight/flush
    resultText = 'Straight';
  } else if (highestSameKindCount === 4) {
    resultText = '4 of a Kind';
  } else if (isFlush === true) { // determine if flush (royal, straight, normal)
    if (isRoyal === true) { // determine if royal flush
      resultText = 'Royal Flush';
    } else if (isStraight === true) { // determine if straight flush, not royal. Need each card to be 1 apart //working
      resultText = 'Straight Flush';
    } else { // hand is a normal flush
      resultText = 'Flush';
    }
  }
  return resultText;
  function isFlushHand(hand) {
    if (hand[0].numSuit === hand[1].numSuit && hand[1].numSuit === hand[2].numSuit &&
      hand[2].numSuit === hand[3].numSuit && hand[3].numSuit === hand[4].numSuit) {
      return true;
    }
    return false;
  }
  function isStraightHand(v0, v1, v2, v3, v4) {
    const compArray = [v0, v1, v2, v3, v4];
    const minNum = Math.min(v0, v1, v2, v3, v4);
    if (compArray.includes(minNum + 1) && compArray.includes(minNum + 2) && compArray.includes(minNum + 3) && compArray.includes(minNum + 4)) {
      return true;
    } else if (compArray.includes(10) && compArray.includes(11) && compArray.includes(12) && compArray.includes(13) && compArray.includes(1)) {
      return true;
    }
    return false;
  }
  function isRoyalHand(hand) {
    if (hand[0].isRoyal === true && hand[1].isRoyal === true &&
      hand[2].isRoyal === true && hand[3].isRoyal === true && hand[4].isRoyal === true) {
      return true;
    }
    return false;
  }
  function classifySameKinds(hand) {
    for (var i = 0; i < 5; i++) {
      var currentKindCount = 1;
      for (let j = 4; j >= 0; j--) {
        if (i !== j) {
          if (hand[i].numValue === hand[j].numValue) {
            currentKindCount++;
          }
        }
      }
      hand[i].sameKindCount = currentKindCount;
      if (currentKindCount === 2) {
        hand[i].hasPair = true;
        if (hand[i].isJackOrBetter === true) {
          hand[i].isJackOrBetterPair = true;
        } else {
          hand[i].isJackOrBetterPair = false;
        }
      } else {
        hand[i].hasPair = false;
      }
    }
    return Math.max(hand[0].sameKindCount, hand[1].sameKindCount, hand[2].sameKindCount, hand[3].sameKindCount, hand[4].sameKindCount);
  }
  function pairExists(hand) {
    for (let i = 0; i < 5; i++) {
      if (hand[i].hasPair === true) {
        return true;
      }
    }
    return false;
  }
  function isTwoPairHand(hand) {
    let numPairs = 0;
    for (let i = 0; i < 5; i++) {
      if (hand[i].hasPair === true) {
        numPairs++;
      }
    }
    if (numPairs === 4) {
      return true;
    }
    return false;
  }
  function isJackOrBetterHand(hand) {
    for (let i = 0; i < 5; i++) {
      if (hand[i].isJackOrBetterPair === true) {
        return true;
      }
    }
    return false;
  }
}
function toggleCardHold(currentHoldElement) {
  if (handsDealt === 1) {
    const holdElement = document.getElementById(currentHoldElement);
    holdElement.classList.toggle('text-opacity');
    const cardNum = parseInt(currentHoldElement.replace(/hold/, ''));
    cards[cardNum].isHeld !== true ? cards[cardNum].isHeld = true : cards[cardNum].isHeld = false;
  }
}

// eslint-disable-next-line no-unused-vars
function toggleBet() {
  if (handsDealt === 0) {
    if (mainContainer.totalCoins - mainContainer.currentBet <= 0) {
      mainContainer.currentBet = 1;
    } else if (mainContainer.currentBet < 5) {
      mainContainer.currentBet++;
    } else {
      mainContainer.currentBet = 1;
    }
    // currentBetSpan.innerText = currentBet;
  }
}

function outOfCoinsDialog() {
  const outOfCoinsDialog = document.getElementById('outOfCoinsDialog');
  if (typeof outOfCoinsDialog.showModal === 'function') {
    outOfCoinsDialog.showModal();
  } else {
    alert('The <dialog> API is not supported by this browser');
  }
  document.getElementById('outOfCoinsCancel').onclick = function() {
    outOfCoinsDialog.close();
  }
}

function winCoinsDialog() {
  const coinsDialog = document.getElementById('winCoinsDialog');
  if (typeof coinsDialog.showModal === 'function') {
    // document.getElementById('coin-win-popup-span').innerText = result;
    // document.getElementById('number-coins-won').innerText = ' ' + currentWin + ' ';
    coinsDialog.showModal();
    setTimeout(function() { coinsDialog.close() }, 2500);
  } else {
    alert('The <dialog> API is not supported by this browser');
  }
  document.getElementById('winCoinsCancel').onclick = function() {
    coinsDialog.close();
  }
}

function winHandDialog() {
  const winDialog = document.getElementById('winHandDialog');
  if (typeof winDialog.showModal === 'function') {
    // document.getElementById('hand-win-popup-span').innerText = result;
    winDialog.showModal();
    setTimeout(function() { winDialog.close() }, 2000);
  } else {
    alert('The <dialog> API is not supported by this browser');
  }
  document.getElementById('winHandCancel').onclick = function() {
    winDialog.close();
  }
}

// eslint-disable-next-line no-unused-vars
function toggleOddsTable() {
  if (oddsDiv.style.display !== 'block') {
    oddsDiv.style.display = 'block';
    showHideOddsButton.innerText = 'Hide Odds';
  } else {
    oddsDiv.style.display = 'none';
    showHideOddsButton.innerText = 'Show Odds';
  }
}
