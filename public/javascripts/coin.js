/* eslint-disable no-unused-vars */
/* eslint-disable semi */
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
    return Math.floor((Math.random() * 2) + 1)
  }
  var result = flip();
  if (result === 1) {
    const coin = 'heads';
    winner = createCoin(coin, winner);
    const headWins = headsWins.push(result);
    headWin.innerText = headWins;
  } else if (result === 2) {
    const coin = 'tails';
    winner = createCoin(coin, winner);
    const tailWins = `${tailsWins.push(result)}`;
    tailWin.innerText = tailWins;
  }
  headWin.className = 'result-tally';
  tailWin.className = 'result-tally';
  animateCoin();
  displayWinText(winner, winnerDiv);
  setTimeout(function() {coinFlipButton.disabled = false;}, 100);
}

function createCoin(coin, winner) {
  const img = document.createElement('img');
  img.className = 'coin img-fluid';
  img.setAttribute('id', 'coin');
  img.src = 'images/' + coin + '.png';
  coinFlipDiv.appendChild(img);
  return coin;
}

function animateCoin() {
  setTimeout(function() {document.getElementById('coin').classList.add('spin-grow');}, 20);
}

function displayWinText(winner, winnerDiv) {
  setTimeout(function() {
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

// function print_winner(){
//   winner = '';
//   document.getElementById("final_winner").innerHTML = final_winner;
// }
