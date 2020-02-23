var heads_wins = [], tails_wins = []; //heads and totals results arrays declared. Has to be declared outside of functions so they can keep incrementing globally
let headWin = document.getElementById("head_win");
let tailWin = document.getElementById("tail_win");
let coinFlipDiv = document.getElementById("coin-flip-div");
let winnerDiv = document.getElementById("winner-div");
headWin.innerText = heads_wins.length;
tailWin.innerText = tails_wins.length;
function coinFlip() {
  let winner = '';
  while (coinFlipDiv.hasChildNodes()) {
    coinFlipDiv.removeChild(coinFlipDiv.lastChild);
  }
  while (winnerDiv.hasChildNodes()) {
    winnerDiv.removeChild(winnerDiv.lastChild);
  }
  function flip(){
    return Math.floor((Math.random()*2)+1)
  }
  var result = flip();
  if (result == 1){
    let coin = "heads";
    winner = createCoin(coin, winner);
    let head_win = heads_wins.push(result);
  headWin.innerText = head_win;
  }
  else if (result == 2) {
    let coin = "tails";
    winner = createCoin(coin, winner);
    let tail_win = `${tails_wins.push(result)}`;
    tailWin.innerText = tail_win;
  }
  headWin.className = "result-tally";
  tailWin.className = "result-tally";
  let text = document.createElement("span");
  text.className ="winner";
  text.innerText = winner;
  winnerDiv.appendChild(text);
  document.getElementById("coin-flip-tally-div").style.display = "block";
}

// function score(){
//   function win(){
//     let winner_text = document.createElement("span");
//     winner_text.setAttribute("id", "final_winner");
//     div = document.getElementById("winner-div");
//     div.appendChild(winner_text);
//   }
//   if ((heads_wins.length + tails_wins.length) % 9 == 0){
//     if (heads_wins.length > tails_wins.length){
//       win();
//       final_winner = `The winner is HEADS with ${heads_wins.length} wins!`
//       print_winner();
//     }
//     else if (tails_wins.length > heads_wins.length) {
//       win();
//       final_winner = `The winner is TAILS with ${tails_wins.length} wins!`
//       print_winner();
//     }
//   }
// }

function coin_Grow() {
  let elem = document.getElementById("coin");
  let growth = 25, rotation = 0;
  let coin_interval = setInterval(frame, 1);
  function frame() {
    if (growth >= 100) {
      clearInterval(coin_interval);
    }
    else {
      rotation=rotation+24;
      growth=growth+1;
      elem.style.width = "calc(" + growth + 'px' + ' + 4vw)';
      elem.style.transform = "rotate(" + rotation + "deg)";
    }
  }
}

function createCoin(coin){
  let img = document.createElement("img");
  img.className ="coin img-fluid";
  img.setAttribute("id", "coin");
  img.src = "assets/images/"+coin+".png";
  coinFlipDiv.appendChild(img);
  coin_Grow();
  return coin;
}

// function print_winner(){
//   winner = '';
//   document.getElementById("final_winner").innerHTML = final_winner;
// }

function clearTally() {
  heads_wins = [], tails_wins = [];
  headWin.innerText = heads_wins.length;
  tailWin.innerText = tails_wins.length;
}
