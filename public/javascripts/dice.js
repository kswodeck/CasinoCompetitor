/* eslint-disable no-unused-vars */
/* eslint-disable semi */
var onesWins = []; var twosWins = []; var threesWins = []; var foursWins = []; var fivesWins = []; var sixesWins = []; // total results arrays declared globally
const oneWin = document.getElementById('one_win');
oneWin.innerText = onesWins.length;
const twoWin = document.getElementById('two_win');
twoWin.innerText = twosWins.length;
const threeWin = document.getElementById('three_win');
threeWin.innerText = threesWins.length;
const fourWin = document.getElementById('four_win');
fourWin.innerText = foursWins.length;
const fiveWin = document.getElementById('five_win');
fiveWin.innerText = fivesWins.length;
const sixWin = document.getElementById('six_win');
sixWin.innerText = sixesWins.length;
const diceRollDiv = document.getElementById('dice-roll-div');

function diceRoll () {
  var currentOnesWins = []; var currentTwosWins = []; var currentThreesWins = []; var currentFoursWins = []; var currentFivesWins = []; var currentSixesWins = [];
  document.getElementById('current_one_win').innerText = '0'; document.getElementById('current_two_win').innerText = '0';
  document.getElementById('current_three_win').innerText = '0'; document.getElementById('current_four_win').innerText = '0';
  document.getElementById('current_five_win').innerText = '0'; document.getElementById('current_six_win').innerText = '0';
  // node2 = document.getElementById("winner-div");
  while (diceRollDiv.hasChildNodes()) {
    diceRollDiv.removeChild(diceRollDiv.lastChild);
  }
  // while (node2.hasChildNodes()) {
  //   node2.removeChild(node2.lastChild);
  // }
  const form = document.getElementById('diceform');
  var diceQuantity = form.elements.dicequantity.value;
  function createDice (dice, i) {
    const img = document.createElement('img');
    img.className = 'dice img-fluid';
    img.setAttribute('id', 'dice' + i);
    img.src = 'images/' + dice + 'dice.png';
    diceRollDiv.appendChild(img);
    // let text = document.createElement("span");
    // text.className ="winner";
    // text.innerText = dice;
    // div = document.getElementById("winner-div");
    // div.appendChild(text);
  }
  function updateDiceValues (dice, result, wins, currentwins) {
    const numWins = wins.push(result);
    document.getElementsByClassName('total')[result - 1].innerText = numWins;
    const currentNumWins = currentwins.push(result);
    document.getElementsByClassName('current')[result - 1].innerText = currentNumWins;
  }
  function roll () {
    return Math.floor((Math.random() * 6) + 1);
  }
  for (let i = 0; i < diceQuantity; i++) {
    const result = roll();
    if (result === 1) {
      const dice = 'one';
      createDice(dice, i);
      updateDiceValues(dice, result, onesWins, currentOnesWins);
    } else if (result === 2) {
      const dice = 'two';
      createDice(dice, i);
      updateDiceValues(dice, result, twosWins, currentTwosWins);
    } else if (result === 3) {
      const dice = 'three';
      createDice(dice, i);
      updateDiceValues(dice, result, threesWins, currentThreesWins);
    } else if (result === 4) {
      const dice = 'four';
      createDice(dice, i);
      updateDiceValues(dice, result, foursWins, currentFoursWins);
    } else if (result === 5) {
      const dice = 'five';
      createDice(dice, i);
      updateDiceValues(dice, result, fivesWins, currentFivesWins);
    } else if (result === 6) {
      const dice = 'six';
      createDice(dice, i);
      updateDiceValues(dice, result, sixesWins, currentSixesWins);
    }
  }
  // let winnerFont = document.getElementsByClassName("winner");
  const diceImage = document.getElementsByClassName('dice');
  if (diceQuantity > 8) {
    for (let i = 0; i < diceImage.length; i++) {
      const imageSize = getComputedStyle(diceImage[i]).getPropertyValue('--dice-width');
      const computedSize = parseInt(imageSize.replace(/%/, ''));
      const newSize = computedSize - (diceQuantity / 4);
      diceImage[i].style.setProperty('--dice-width', newSize + '%');
    }
  }
  document.getElementById('dice-roll-current-div').style.display = 'block';
  document.getElementById('dice-roll-tally-div').style.display = 'block';
  document.getElementById('dice-clear-tally-col').style.display = 'block';
}

function clearTally () {
  onesWins = []; twosWins = []; threesWins = []; foursWins = []; fivesWins = []; sixesWins = [];
  oneWin.innerText = onesWins.length;
  twoWin.innerText = twosWins.length;
  threeWin.innerText = threesWins.length;
  fourWin.innerText = foursWins.length;
  fiveWin.innerText = fivesWins.length;
  sixWin.innerText = sixesWins.length;
}
