/* eslint-disable no-unused-vars */
var headsWins = []; var tailsWins = [];
const headWin = document.getElementById('head_win');
const tailWin = document.getElementById('tail_win');
const coinFlipDiv = document.getElementById('coin-flip-div');
const winnerDiv = document.getElementById('winner-div');
var coinFlipButton = document.getElementById('coin-flip-button');
headWin.innerText = headsWins.length;
tailWin.innerText = tailsWins.length;
function coinFlip () {
  coinFlipButton.disabled = true;
  let winner = '';
  while (coinFlipDiv.hasChildNodes()) {
    coinFlipDiv.removeChild(coinFlipDiv.lastChild);
  }
  while (winnerDiv.hasChildNodes()) {
    winnerDiv.removeChild(winnerDiv.lastChild);
  }
  function flip () {
    return Math.floor((Math.random() * 2) + 1);
  }
  var result = flip();
  var coin;
  if (result === 1) {
    coin = 'heads';
    winner = createCoin(coin);
    const headWins = headsWins.push(result);
    headWin.innerText = headWins;
  } else if (result === 2) {
    coin = 'tails';
    winner = createCoin(coin);
    const tailWins = `${tailsWins.push(result)}`;
    tailWin.innerText = tailWins;
  }
  headWin.className = 'result-tally';
  tailWin.className = 'result-tally';
  animateCoin();
  setTimeout(() => document.getElementById('coin').src = 'images/' + coin + '.webp', 350);
  displayWinText(winner, winnerDiv);
  setTimeout(() => coinFlipButton.disabled = false, 500);
}

function createCoin(coin) {
  const img = document.createElement('img');
  img.className = 'coin img-fluid';
  img.setAttribute('id', 'coin');
  if (coin == 'heads') {
    img.src = 'images/' + 'tails.webp';
  } else {
    img.src = 'images/' + 'heads.webp';
  }
  coinFlipDiv.appendChild(img);
  return coin;
}

var animateCoin = () => document.getElementById('coin').classList.add('flip-grow');

function displayWinText(winner, winnerDiv) {
  setTimeout(() => {
    const text = document.createElement('span');
    text.innerText = winner;
    winnerDiv.appendChild(text);
    text.classList.add('winner');
    document.getElementById('coin-flip-tally-div').style.display = 'block';
    }, 300);
}

function clearTally () {
  headsWins = [];
  tailsWins = [];
  headWin.innerText = headsWins.length;
  tailWin.innerText = tailsWins.length;
}
