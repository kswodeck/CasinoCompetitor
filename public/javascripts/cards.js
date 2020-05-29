/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var cards = [], cards2 = [];
var handsDealt = 0, currentHand = 0, currentWin = 0;
const pageTitle = document.getElementsByTagName('title')[0];
if (pageTitle.innerText == 'Competitive Poker' || document.getElementById('page-heading').innerText == 'Competitive Poker') {
  var coinsInput = document.getElementById('coinsInput');
  var totalCoinsSpan = document.getElementById('total-coins-span');
  var currentBetSpan = document.getElementById('current-bet-span');
  var totalCoins = totalCoinsSpan.innerText;
  var currentBet = 1;
  var updateCoinsStart, updateCoinsEnd;
  if (coinsInput.value < 1 || coinsInput.value == null) {
    outOfCoinsDialog();
  }
}
const cardDealButton = document.getElementById('card-deal-button');
const handRankingHeading = document.getElementById('hand-ranking-heading');

function getCards() {
  cardDealButton.disabled = true;
  if (totalCoins <= 0 && handsDealt === 0) {
    outOfCoinsDialog();
    handsDealt = 2;
  }
  const winButton = document.getElementById('win-button');
  const currentWinSpan = document.getElementById('current-win-span');
  const betButton = document.getElementById('bet-button');
  currentWinSpan.innerText = 0;
  handRankingHeading.style.display = 'none';
  winButton.style.backgroundColor = 'crimson';
  winButton.style.boxShadow = '0 6px var(--darkcrimson)';
  for (var currentCard = 0; currentCard < 5; currentCard++) {
    let holdCurrentCard = document.getElementById('hold' + currentCard);
    var currentValues = [];
    if (handsDealt === 0) {
      currentHand = getFirstHand(currentCard,holdCurrentCard,currentValues);
      betButton.disabled = true;
    } else if (handsDealt === 1) {
      currentHand = getSecondHand(currentCard, holdCurrentCard, currentValues);
    } else {
      lastHandTeardown(holdCurrentCard, currentCard, cardDealButton);
      betButton.disabled = false;
    }
  }
  if (handsDealt === 0) {
    updateCoinsStart = new Promise((resolve, reject) => {
    totalCoins = totalCoins - currentBet;
    totalCoinsSpan.innerText = totalCoins;
    resolve(5);
    });
    // totalCoins = totalCoins - currentBet;
    // totalCoinsSpan.innerText = totalCoins;
  }
  getGameResults(handsDealt, handRankingHeading, cardDealButton, collectCoins);
  if (handsDealt === 2) {
    handsDealt = 0;
    for (let currentCard = 0; currentCard < 5; currentCard++) {
      let currentCardElement = document.getElementsByClassName('cards')[currentCard];
      currentCardElement.classList.remove('flip');
      currentCardElement.classList.remove('fadeInOut-card');
    }

  }
  else {
    handsDealt++;
  }
  if (totalCoins - currentBet < 0 && handsDealt === 0) {
    while (totalCoins - currentBet < 0 && currentBet !== 1) {
      currentBet--;
    }
    if (currentBet == 1) {
      betButton.disabled = true;
    }
    currentBetSpan.innerText = currentBet;
  }
  function collectCoins(resultText) {
    if (resultText === 'Jacks or Better') {
      currentWin = currentBet;
    } else if (resultText === 'Two Pair') {
      currentWin = currentBet * 2;
    } else if (resultText === '3 of a Kind') {
      currentWin = currentBet * 3;
    } else if (resultText === 'Straight') {
      currentWin = currentBet * 4;
    } else if (resultText === 'Flush') {
      currentWin = currentBet * 6;
    } else if (resultText === 'Full House') {
      currentWin = currentBet * 9;
    } else if (resultText === '4 of a Kind') {
      currentWin = currentBet * 25;
    } else if (resultText === 'Straight Flush') {
      currentWin = currentBet * 50;
    } else if (resultText === 'Royal Flush') {
      if (currentBet < 5) {
        currentWin = currentBet * 250;
      } else {
        currentWin = 4000;
      }
    }
    updateCoinsEnd = new Promise((resolve, reject) => {
      totalCoins = totalCoins + currentWin;
      totalCoinsSpan.innerText = totalCoins;
      resolve(5);
    });
    winButton.style.backgroundColor = 'darkblue';
    winButton.style.boxShadow = '0 6px var(--darkerblue)';
    currentWinSpan.innerText = currentWin;
    winCoinsDialog(resultText);
    updateStoredCoins(updateCoinsEnd);
  }
}

function getCasualCards() {
  cardDealButton.disabled = true;
  handRankingHeading.style.display = 'none';
  var oddsDiv = document.getElementById('hand-odds-div');
  var showHideOddsButton = document.getElementById('show-hide-odds-button');
  for (var currentCard = 0; currentCard < 5; currentCard++) {
    let holdCurrentCard = document.getElementById('hold' + currentCard);
    let currentValues = [];
    if (handsDealt === 0) {
      currentHand = getFirstHand(currentCard, holdCurrentCard, currentValues);
      oddsDiv.style.display = 'none';
      showHideOddsButton.style.display = 'none';
    } else if (handsDealt === 1) {
      currentHand = getSecondHand(currentCard, holdCurrentCard, currentValues);
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
    for (let currentCard = 0; currentCard < 5; currentCard++) {
      let currentCardElement = document.getElementsByClassName('cards')[currentCard];
      currentCardElement.classList.remove('flip');
      currentCardElement.classList.remove('fadeInOut-card');
    }
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

function getFirstHand(currentCard, holdCurrentCard, currentValues) {
  let currentCardElement = document.getElementsByClassName('cards')[currentCard];
  currentCardElement.classList.add('interactive-img');
  holdCurrentCard.classList.add('text-opacity');
  let curCard = document.getElementsByClassName('cards')[currentCard];
  curCard.classList.add('flip');
  let isSameIdentity = true;
  while (isSameIdentity) {
    currentValues = getRandomCardValues();
    isSameIdentity = cards.some((value) => {
      return value.identity == currentValues[2];
    });
  }
  cards.push(new Card(currentValues[0], currentValues[1], currentValues[2]));
  setTimeout(() => {
    curCard.src = cards[currentCard].imgSrc;
  }, 200);
  return cards;
}

function getSecondHand(currentCard, holdCurrentCard, currentValues) {
  holdCurrentCard.classList.add('text-opacity');
  let currentCardElement = document.getElementsByClassName('cards')[currentCard];
  currentCardElement.classList.remove('interactive-img');
  let isSameIdHand1 = true, isSameIdHand2 = true;
  while (isSameIdHand1 || isSameIdHand2) {
    currentValues = getRandomCardValues();
    isSameIdHand1 = cards.some((value) => {
      return value.identity == currentValues[2];
    });
    isSameIdHand2 = cards2.some((value) => {
      return value.identity == currentValues[2];
    });
  }
  currentCardElement.classList.remove('flip');
  if (cards[currentCard].isHeld) {
    cards2.push(new Card(cards[currentCard].numValue, cards[currentCard].numSuit, cards[currentCard].identity));
  } else {
    cards2.push(new Card(currentValues[0], currentValues[1], currentValues[2]));
      currentCardElement.classList.add('fadeInOut-card');
    setTimeout(() => {
      document.getElementsByClassName('cards')[currentCard].src = cards2[currentCard].imgSrc;
    }, 200);
  }
  cardDealButton.innerText = 'Play Again';
  return cards2;
}

function lastHandTeardown(holdCurrentCard, currentCard) {
  holdCurrentCard.classList.add('text-opacity');
  document.getElementsByClassName('cards')[currentCard].src = 'images/cards/card_standard_blue_back.png';
  cardDealButton.innerText = 'Deal Cards';
  currentWin = 0;
  cards = [];
  cards2 = [];
}

function getGameResults(handsDealt, handRankingHeading, cardDealButton, winFunction){
  if (handsDealt < 2) {
    resultText = getHandRanking(currentHand);
    if (resultText === 'Game Over') {
      handRankingHeading.style.color = 'crimson'; // if no hand category has been acheived, red text
    } else {
      handRankingHeading.style.color = 'darkblue'; // if a hand category has been acheived, blue text
      if (handsDealt === 1) {
        setTimeout(() => {winFunction(resultText);}, 300);
      }
    }
    if (handsDealt === 1 || resultText !== 'Game Over') {
      setTimeout(() => {
        handRankingHeading.innerText = resultText;
        handRankingHeading.style.display = 'block';
      }, 250);
    }
  }
  if (pageTitle.innerText == 'Competitive Poker' || document.getElementById('page-heading').innerText == 'COMPETITIVE POKER') {
    if (handsDealt == 0) {
      updateStoredCoins(updateCoinsStart);
    }
  }
  setTimeout(() => {
    cardDealButton.disabled = false;
  }, 400);
}

function getHandRanking(hand) {
  let resultText = 'Game Over';
  const highestSameKindCount = classifySameKinds(hand);
  const isFlush = isFlushHand(hand);
  const isRoyal = isRoyalHand(hand);
  const isStraight = isStraightHand(hand[0].numValue, hand[1].numValue, hand[2].numValue, hand[3].numValue, hand[4].numValue);
  if (isTwoPairHand(hand)) {
    resultText = 'Two Pair';
  } else if (isJackOrBetterHand(hand) && highestSameKindCount === 2) {
    resultText = 'Jacks or Better';
  } else if (highestSameKindCount === 3) {
    if (pairExists(hand)) {
      resultText = 'Full House';
    } else {
      resultText = '3 of a Kind';
    }
  } else if (isStraight && !isFlush) { // normal straight, not a royal straight/flush
    resultText = 'Straight';
  } else if (highestSameKindCount === 4) {
    resultText = '4 of a Kind';
  } else if (isFlush) { // determine if flush (royal, straight, normal)
    if (isRoyal) { // determine if royal flush
      resultText = 'Royal Flush';
    } else if (isStraight) { // determine if straight flush, not royal. Need each card to be 1 apart //working
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
    if (hand[0].isRoyal && hand[1].isRoyal &&
      hand[2].isRoyal && hand[3].isRoyal && hand[4].isRoyal) {
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
        if (hand[i].isJackOrBetter) {
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
      if (hand[i].hasPair) {
        return true;
      }
    }
    return false;
  }
  function isTwoPairHand(hand) {
    let numPairs = 0;
    for (let i = 0; i < 5; i++) {
      if (hand[i].hasPair) {
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
      if (hand[i].isJackOrBetterPair) {
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
    !cards[cardNum].isHeld ? cards[cardNum].isHeld = true : cards[cardNum].isHeld = false;
  }
}

function toggleBet() {
  if (handsDealt === 0) {
    if (totalCoins - currentBet <= 0) {
      currentBet = 1;
    } else if (currentBet < 5) {
      currentBet++;
    } else {
      currentBet = 1;
    }
    currentBetSpan.innerText = currentBet;
  }
}

function outOfCoinsDialog() {
  const outOfCoinsDialog = document.getElementById('outOfCoinsDialog');
  if (typeof outOfCoinsDialog.showModal === 'function') {
    outOfCoinsDialog.showModal();
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('outOfCoinsCancel').onclick = () => {
    outOfCoinsDialog.close();
  }
}

function winCoinsDialog(result) {
  const coinsDialog = document.getElementById('winCoinsDialog');
  if (typeof coinsDialog.showModal === 'function') {
    document.getElementById('coin-win-popup-span').innerText = result;
    document.getElementById('number-coins-won').innerText = ' ' + currentWin + ' ';
    coinsDialog.showModal();
    setTimeout(() => {coinsDialog.close()}, 2500);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('winCoinsCancel').onclick = () => {
    coinsDialog.close();
  }
}

function winHandDialog(result) {
  const winDialog = document.getElementById('winHandDialog');
  if (typeof winDialog.showModal === 'function') {
    document.getElementById('hand-win-popup-span').innerText = result;
    winDialog.showModal();
    setTimeout(() => { winDialog.close() }, 2500);
  } else {
    console.log('The <dialog> API is not supported by this browser');
  }
  document.getElementById('winHandCancel').onclick = () => {
    winDialog.close();
  }
}

function toggleOddsTable() {
  let oddsDiv = document.getElementById('hand-odds-div');
  let showHideOddsButton = document.getElementById('show-hide-odds-button');
  if (oddsDiv.style.display !== 'block') {
    oddsDiv.style.display = 'block';
    showHideOddsButton.innerText = 'Hide Odds';
  } else {
    oddsDiv.style.display = 'none';
    showHideOddsButton.innerText = 'Show Odds';
  }
}

function updateStoredCoins(updateCoins) {
  updateCoins.then(() => {
    if (totalCoins != parseInt(coinsInput.value)) {
      coinsInput.value = totalCoins;
    } else {
      return false;
    }
    document.getElementById('currentWinInput').value = currentWin;
    document.getElementById('cardsForm').submit();
  });
}