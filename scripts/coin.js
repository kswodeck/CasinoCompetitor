var heads_wins = [], tails_wins = []; //heads and totals results arrays declared. Has to be declared outside of functions so they can keep incrementing globally
document.getElementById("head_win").innerText = heads_wins.length; document.getElementById("tail_win").innerText = tails_wins.length;
function coinFlip() {
  let winner = '';
  let node1 = document.getElementById("coin-flip-div"), node2 = document.getElementById("winner-div");
  while (node1.hasChildNodes()) {
    node1.removeChild(node1.lastChild);
  }
  while (node2.hasChildNodes()) {
    node2.removeChild(node2.lastChild);
  }
  function flip(){
    return Math.floor((Math.random()*2)+1)
  }
  var result = flip();
  if (result == 1){
    let coin = "heads";
    winner = createCoin(coin, winner);
    let head_win = heads_wins.push(result);
    document.getElementById("head_win").innerText = head_win;
  }
  else if (result == 2) {
    let coin = "tails";
    winner = createCoin(coin, winner);
    let tail_win = `${tails_wins.push(result)}`;
    document.getElementById("tail_win").innerText = tail_win;
  }
  document.getElementById("head_win").className = "result-tally", document.getElementById("tail_win").className = "result-tally";
  let text = document.createElement("span");
  text.className ="winner";
  text.innerText = winner;
  let div = document.getElementById("winner-div");
  div.appendChild(text);
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
  let source = document.getElementById("coin-flip-div");
  source.appendChild(img);
  coin_Grow();
  return coin;
}

// function print_winner(){
//   winner = '';
//   document.getElementById("final_winner").innerHTML = final_winner;
// }

function clearTally() {
  heads_wins = [], tails_wins = [];
  document.getElementById("head_win").innerText = heads_wins.length; document.getElementById("tail_win").innerText = tails_wins.length;
}
