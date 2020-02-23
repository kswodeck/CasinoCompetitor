var ones_wins = [], twos_wins = [], threes_wins = [], fours_wins = [], fives_wins = [], sixes_wins = []; //total results arrays declared globally
let oneWin = document.getElementById("one_win");
oneWin.innerText = ones_wins.length;
let twoWin = document.getElementById("two_win");
twoWin = innerText = twos_wins.length;
let threeWin = document.getElementById("three_win");
threeWin.innerText = threes_wins.length;
let fourWin = document.getElementById("four_win");
fourWin.innerText = fours_wins.length;
let fiveWin = document.getElementById("five_win");
fiveWin.innerText = fives_wins.length;
let sixWin = document.getElementById("six_win");
sixWin.innerText = sixes_wins.length;
let diceRollDiv = document.getElementById("dice-roll-div");

function diceRoll() {
  var current_ones_wins = [], current_twos_wins = [], current_threes_wins = [], current_fours_wins = [], current_fives_wins = [], current_sixes_wins = [];
  document.getElementById("current_one_win").innerText = "0"; document.getElementById("current_two_win").innerText = "0";
  document.getElementById("current_three_win").innerText = "0"; document.getElementById("current_four_win").innerText = "0";
  document.getElementById("current_five_win").innerText = "0"; document.getElementById("current_six_win").innerText = "0";
  // node2 = document.getElementById("winner-div");
  while (diceRollDiv.hasChildNodes()) {
    diceRollDiv.removeChild(diceRollDiv.lastChild);
  }
  // while (node2.hasChildNodes()) {
  //   node2.removeChild(node2.lastChild);
  // }
  let form = document.getElementById("diceform");
  var dice_quantity = form.elements.dicequantity.value;
  function createDice(dice, i) {
    let img = document.createElement("img");
    img.className = "dice img-fluid";
    img.setAttribute("id", "dice" + i);
    img.src = "assets/images/" + dice + "dice.png";
    diceRollDiv.appendChild(img);
    // let text = document.createElement("span");
    // text.className ="winner";
    // text.innerText = dice;
    // div = document.getElementById("winner-div");
    // div.appendChild(text);
  }
  function updateDiceValues(dice,result,wins,current_wins) {
    let numWins = wins.push(result);
    document.getElementsByClassName("total")[result-1].innerText = numWins;
    let currentNumWins = current_wins.push(result);
    document.getElementsByClassName("current")[result-1].innerText = currentNumWins;
  }
  function roll(){
    return Math.floor((Math.random()*6)+1);
  }
    for (let i=0; i<dice_quantity; i++)
    {
      let result = roll();
      if (result == 1){
        let dice = "one";
        createDice(dice,i);
        updateDiceValues(dice,result,ones_wins,current_ones_wins);
      }
      else if (result == 2) {
        let dice = "two";
        createDice(dice,i);
        updateDiceValues(dice,result,twos_wins,current_twos_wins);
      }
      else if (result == 3) {
        let dice = "three";
        createDice(dice,i);
        updateDiceValues(dice,result,threes_wins,current_threes_wins);
      }
      else if (result == 4) {
        let dice = "four";
        createDice(dice,i);
        updateDiceValues(dice,result,fours_wins,current_fours_wins);
      }
      else if (result == 5) {
        let dice = "five";
        createDice(dice,i);
        updateDiceValues(dice,result,fives_wins,current_fives_wins);
      }
      else if (result == 6) {
        let dice = "six";
        createDice(dice,i);
        updateDiceValues(dice,result,sixes_wins,current_sixes_wins);
      }
    }
    // let winnerFont = document.getElementsByClassName("winner");
    let diceImage = document.getElementsByClassName("dice");
    if (dice_quantity > 8){
      for (let i=0; i < diceImage.length; i++){
        let imageSize = getComputedStyle(diceImage[i]).getPropertyValue("--dice-width");
        let computedSize = parseInt(imageSize.replace(/%/,""));
        let newSize = computedSize - (dice_quantity/4);
        diceImage[i].style.setProperty("--dice-width", newSize + "%");
      }
    }
  document.getElementById("dice-roll-current-div").style.display = "block";
  document.getElementById("dice-roll-tally-div").style.display = "block";
  document.getElementById("dice-clear-tally-col").style.display = "block";
}

function clearTally() {
  ones_wins = [], twos_wins = [], threes_wins = [], fours_wins = [], fives_wins = [], sixes_wins = [];
  oneWin.innerText = ones_wins.length;
  twoWin.innerText = twos_wins.length;
  threeWin.innerText = threes_wins.length;
  fourWin.innerText = fours_wins.length;
  fiveWin.innerText = fives_wins.length;
  sixWin.innerText = sixes_wins.length;
}
