/* eslint-disable semi */
var handsDealt = 0;
var cards = [];
var cards2 = [];
var totalCoins = 100;
var currentBet = 1;
const totalCoinsSpan = document.getElementById('total-coins-span');
const currentBetSpan = document.getElementById('current-bet-span');
const oddsDiv = document.getElementById('hand-odds-div');
const showHideOddsButton = document.getElementById('show-hide-odds-button');
const cardDealButton = document.getElementById('card-deal-button');
const handRankingHeading = document.getElementById('hand-ranking-heading');
if (window.location.pathname.includes('practice-cards.html') == 'false') {
  totalCoinsSpan.innerText = totalCoins;
}

// eslint-disable-next-line no-unused-vars
function getCards() {
  if (totalCoins <= 0 && handsDealt !== 1 && handsDealt !== 2) {
    outOfCoinsDialog();
    handsDealt = 2;
  }
  var currentHand = 0;
  const winButton = document.getElementById('win-button');
  const currentWinSpan = document.getElementById('current-win-span');
  const betButton = document.getElementById('bet-button');
  cardDealButton.setAttribute('disabled', 'disabled');
  currentWinSpan.innerText = 0;
  handRankingHeading.style.display = 'none';
  winButton.style.backgroundColor = 'crimson';
  if (handsDealt >= 3) {
    handsDealt = 0;
  }
  for (let currentCard = 0; currentCard < 5; currentCard++) {
    let holdCurrentCard = document.getElementById('hold' + currentCard);
    var currentValues = [];
    if (handsDealt === 0) {
      currentHand = getFirstHand(currentCard,holdCurrentCard,currentValues);
      document.getElementsByClassName('cards')[currentCard].src = cards[currentCard].imgSrc;
      betButton.setAttribute('disabled', 'disabled');
    } else if (handsDealt === 1) {
      currentHand = getSecondHand(currentCard, holdCurrentCard, currentValues);
      if (currentCard === 4) {
        cards = [];
        cards2 = [];
        handRankingHeading.style.display = 'block';
      }
    } else {
      lastHandTeardown(holdCurrentCard,currentCard,cardDealButton);
      betButton.removeAttribute('disabled');
    }
  }
  if (handsDealt === 0) {
    totalCoins = totalCoins - currentBet;
    totalCoinsSpan.innerText = totalCoins;
  }
  getGameResults(handsDealt, handRankingHeading, cardDealButton, currentHand, collectCoins);
  handsDealt++;
  if (totalCoins - currentBet < 0 && handsDealt !== 1 && handsDealt !== 2) {
    while (totalCoins - currentBet < 0 && currentBet !== 1) {
      currentBet--;
    }
    currentBetSpan.innerText = currentBet;
  }
  function collectCoins(result) {
    let currentWin = 0;
    if (result === 'Jacks or Better') {
      currentWin = currentBet;
    } else if (result === 'Two Pair') {
      currentWin = currentBet * 2;
    } else if (result === '3 of a Kind') {
      currentWin = currentBet * 3;
    } else if (result === 'Straight') {
      currentWin = currentBet * 4;
    } else if (result === 'Flush') {
      currentWin = currentBet * 6;
    } else if (result === 'Full House') {
      currentWin = currentBet * 9;
    } else if (result === '4 of a Kind') {
      currentWin = currentBet * 25;
    } else if (result === 'Straight Flush') {
      currentWin = currentBet * 50;
    } else if (result === 'Royal Flush') {
      if (currentBet < 5) {
        currentWin = currentBet * 250;
      } else {
        currentWin = 4000;
      }
    }
    totalCoins = totalCoins + currentWin;
    winButton.style.backgroundColor = 'darkblue';
    totalCoinsSpan.innerText = totalCoins;
    currentWinSpan.innerText = currentWin;
    winCoinsDialog(currentWin, result);
  }
}

function getPracticeCards() {
  var currentHand = 0;
  cardDealButton.setAttribute('disabled', 'disabled');
  handRankingHeading.style.display = 'none';
  if (handsDealt >= 3) {
    handsDealt = 0;
  }
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
  getGameResults(handsDealt, handRankingHeading, cardDealButton, currentHand, winHandDialog);
  handsDealt++;
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
    this.imgSrc = '../assets/images/cards/' + this.identity + '.png';
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
      holdCurrentCard.style.opacity = 0.0001;
      var isSameIdentity = true;
      while (isSameIdentity === true) {
        if (currentCard === 0) {
          isSameIdentity = false;
        }
        currentValues = getRandomCardValues();
        if (cards.filter(x => (x.identity === currentValues[2])).length === 0) {
          isSameIdentity = false;
        }
      }
      cards.push(new Card(currentValues[0], currentValues[1], currentValues[2]));
      document.getElementsByClassName('cards')[currentCard].src = cards[currentCard].imgSrc;
      return cards;
}

function getSecondHand(currentCard,holdCurrentCard,currentValues) {
  holdCurrentCard.style.opacity = 0.0001;
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
  cardDealButton.innerText = 'Play Again';
  return cards2;
}

function lastHandTeardown(holdCurrentCard,currentCard,cardDealButton) {
  holdCurrentCard.style.opacity = 0.0001;
  document.getElementsByClassName('cards')[currentCard].src = '../assets/images/cards/card_standard_blue_back.png';
  cardDealButton.innerText = 'Deal Cards';
}

function getGameResults(handsDealt, handRankingHeading, cardDealButton, currentHand, winFunction){
  if (handsDealt < 2) {
    var resultText = getHandRanking(currentHand);
    handRankingHeading.innerText = resultText;
    if (resultText === 'Game Over') {
      handRankingHeading.style.color = 'crimson'; // if no hand category has been acheived, red text
    } else {
      handRankingHeading.style.display = 'block';
      handRankingHeading.style.color = 'darkblue'; // if a hand category has been acheived, blue text
      if (handsDealt === 1) {
        winFunction(resultText);
      }
    }
  }
  cardDealButton.removeAttribute('disabled');
}

function getHandRanking(hand) {
  const highestSameKindCount = classifySameKinds(hand);
  const isFlush = isFlushHand(hand);
  const isRoyal = isRoyalHand(hand);
  const isStraight = isStraightHand(hand[0].numValue, hand[1].numValue, hand[2].numValue, hand[3].numValue, hand[4].numValue);
  let result = 'Game Over';
  if (isTwoPairHand(hand) === true) {
    result = 'Two Pair';
  } else if (isJackOrBetterHand(hand) === true && highestSameKindCount === 2) {
    result = 'Jacks or Better';
  } else if (highestSameKindCount === 3) {
    if (pairExists(hand) === true) {
      result = 'Full House';
    } else {
      result = '3 of a Kind';
    }
  } else if (isStraight === true && isFlush === false) { // normal straight, not a royal straight/flush
    result = 'Straight';
  } else if (highestSameKindCount === 4) {
    result = '4 of a Kind';
  } else if (isFlush === true) { // determine if flush (royal, straight, normal)
    if (isRoyal === true) { // determine if royal flush
      result = 'Royal Flush';
    } else if (isStraight === true) { // determine if straight flush, not royal. Need each card to be 1 apart //working
      result = 'Straight Flush';
    } else { // hand is a normal flush
      result = 'Flush';
    }
  }
  return result;

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
        if (hand[i] !== hand[j]) {
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
    holdElement.style.opacity != 1 ? holdElement.style.opacity = 1 : holdElement.style.opacity = 0.0001;
    const cardNum = parseInt(currentHoldElement.replace(/hold/, ''));
    cards[cardNum].isHeld !== true ? cards[cardNum].isHeld = true : cards[cardNum].isHeld = false;
  }
}

// eslint-disable-next-line no-unused-vars
function toggleBet() {
  if (handsDealt === 0 || handsDealt === 3) {
    if (totalCoins - currentBet <= 0) {
      currentBet = 1;
    } else if (currentBet < 5) {
      currentBet++;
    } else {
      currentBet = 1;
    }
    currentBetSpan.innerText = currentBet;
  } else {

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

function winCoinsDialog(currentWin, result) {
  const coinsDialog = document.getElementById('winCoinsDialog');
  if (typeof coinsDialog.showModal === 'function') {
    document.getElementById('coin-win-popup-span').innerText = result;
    document.getElementById('number-coins-won').innerText = ' ' + currentWin + ' ';
    coinsDialog.showModal();
    setTimeout(function() { coinsDialog.close() }, 2500);
  } else {
    alert('The <dialog> API is not supported by this browser');
  }
  document.getElementById('winCoinsCancel').onclick = function() {
    coinsDialog.close();
  }
}

function winHandDialog(result) {
  const winDialog = document.getElementById('winHandDialog');
  if (typeof winDialog.showModal === 'function') {
    document.getElementById('hand-win-popup-span').innerText = result;
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
  if (oddsDiv.style.display === 'none') {
    oddsDiv.style.display = 'block';
    showHideOddsButton.innerText = 'Hide Odds';
  } else {
    oddsDiv.style.display = 'none';
    showHideOddsButton.innerText = 'Show Odds';
  }
}
