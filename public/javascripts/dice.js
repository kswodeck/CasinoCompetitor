/* eslint-disable no-unused-vars */
var onesWins = [], twosWins = [], threesWins = [], foursWins = [], fivesWins = [], sixesWins = []; // results arrays declared
var diceRollDiv = document.getElementById('dice-roll-div');
var diceRollButton = document.getElementById('dice-roll-button');
var currentTallys = document.getElementsByClassName('current');
var totalTallys = document.getElementsByClassName('total');

function diceRoll () {
  diceRollButton.disabled = true;
  var currentOnesWins = [], currentTwosWins = [], currentThreesWins = [], currentFoursWins = [], currentFivesWins = [], currentSixesWins = [];
  for (let i = 0; i < currentTallys.length; i++) {
    currentTallys[i].innerText = '0';
  }
  // node2 = document.getElementById("winner-div");
  while (diceRollDiv.hasChildNodes()) {
    diceRollDiv.removeChild(diceRollDiv.lastChild);
  }
  // while (node2.hasChildNodes()) {
  //   node2.removeChild(node2.lastChild);
  // }
  var diceQuantity = document.getElementById('dicequantity').value;
  function createDice (dice, i) {
    const img = document.createElement('img');
    img.className = 'dice img-fluid';
    img.setAttribute('id', 'dice' + i);
    img.src = 'images/' + dice + 'dice.webp';
    diceRollDiv.appendChild(img);
      // let text = document.createElement("span");
      // text.className ="winner";
      // text.innerText = dice;
      // let winDiv = document.getElementById("winner-div");
      // winDiv.appendChild(text);
  }
  function updateDiceValues (result, wins, currentwins) {
    document.getElementsByClassName('total')[result - 1].innerText = wins.push(result);
    document.getElementsByClassName('current')[result - 1].innerText = currentwins.push(result);
  }
  var roll = () => Math.floor((Math.random() * 6) + 1);
  for (let i = 0; i < diceQuantity; i++) {
    const result = roll();
    let winArr, curWinArr;
    createDice(result, i);
    if (result === 1) { //possible refactor on conditionals
      winArr = onesWins, curWinArr = currentOnesWins;
    } else if (result === 2) {
      winArr = twosWins, curWinArr = currentTwosWins;
    } else if (result === 3) {
      winArr = threesWins, curWinArr = currentThreesWins;
    } else if (result === 4) {
      winArr = foursWins, curWinArr = currentFoursWins;
    } else if (result === 5) {
      winArr = fivesWins, curWinArr = currentFivesWins;
    } else if (result === 6) {
      winArr = sixesWins, curWinArr = currentSixesWins;
    }
    updateDiceValues(result, winArr, curWinArr);
  }
  // let winnerFont = document.getElementsByClassName("winner");
  const diceImage = document.getElementsByClassName('dice');
  if (diceQuantity > 5) {
    var diceWidth = '0.6%';
    var diceMinWidth = '5px';
    var diceMargin = 'calc(15px + 2.2%)';
    if (diceQuantity > 10) {
      diceWidth = '0.4%';
      diceMargin = 'calc(12px + 1.5%)';
      diceMinWidth = '4px';
    }
    for (let i = 0; i < diceImage.length; i++) {
      diceImage[i].style.setProperty('width', diceWidth);
      diceImage[i].style.setProperty('margin', diceMargin);
      diceImage[i].style.setProperty('min-width', diceMinWidth);
    }
  } 
  document.getElementById('dice-roll-current-div').style.display = 'block';
  document.getElementById('dice-roll-tally-div').style.display = 'block';
  document.getElementById('dice-clear-tally-col').style.display = 'block';
  animateDice();
  setTimeout(() => diceRollButton.disabled = false, 10);
}

function animateDice() {
    let diceElements = document.getElementsByClassName('dice');
    for (let i=0; i<diceElements.length; i++) {
      diceElements[i].classList.add('spin-grow');
    }
}

function clearTally () {
  onesWins = []; twosWins = []; threesWins = []; foursWins = []; fivesWins = []; sixesWins = [];
  for (let i = 0; i < totalTallys.length; i++) {
    totalTallys[i].innerText = '0';
  }
}
