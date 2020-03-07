/* eslint-disable no-unused-vars */
/* eslint-disable semi */
var headsWins = []; var tailsWins = []; // heads and totals results arrays declared. Has to be declared outside of functions so they can keep incrementing globally
const headWin = document.getElementById('head_win');
const tailWin = document.getElementById('tail_win');
const coinFlipDiv = document.getElementById('coin-flip-div');
const winnerDiv = document.getElementById('winner-div');
headWin.innerText = headsWins.length;
tailWin.innerText = tailsWins.length;
function coinFlip () {
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
  const text = document.createElement('span');
  text.className = 'winner';
  text.innerText = winner;
  winnerDiv.appendChild(text);
  document.getElementById('coin-flip-tally-div').style.display = 'block';
}

// function score(){
//   function win(){
//     let winner_text = document.createElement("span");
//     winner_text.setAttribute("id", "final_winner");
//     div = document.getElementById("winner-div");
//     div.appendChild(winner_text);
//   }
//   if ((headsWins.length + tailsWins.length) % 9 == 0){
//     if (headsWins.length > tailsWins.length){
//       win();
//       final_winner = `The winner is HEADS with ${headsWins.length} wins!`
//       print_winner();
//     }
//     else if (tailsWins.length > headsWins.length) {
//       win();
//       final_winner = `The winner is TAILS with ${tailsWins.length} wins!`
//       print_winner();
//     }
//   }
// }

function createCoin (coin) {
  const img = document.createElement('img');
  img.className = 'coin img-fluid';
  img.setAttribute('id', 'coin');
  img.src = 'images/' + coin + '.png';
  coinFlipDiv.appendChild(img);
  coinGrow();
  return coin;
  function coinGrow () {
    const elem = document.getElementById('coin');
    let growth = 25; let rotation = 0;
    const coinInterval = setInterval(frame, 1);
    function frame () {
      if (growth >= 100) {
        clearInterval(coinInterval);
      } else {
        rotation = rotation + 24;
        growth = growth + 1;
        elem.style.width = 'calc(' + growth + 'px' + ' + 4vw)';
        elem.style.transform = 'rotate(' + rotation + 'deg)';
      }
    }
  }
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
