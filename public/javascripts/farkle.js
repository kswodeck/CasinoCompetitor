/* eslint-disable no-unused-vars */
var diceValues = [];
var rollRemaining = true;
var diceRolls = 0;
var diceRollDiv = document.getElementById('dice-roll-div');
var diceRollButton = document.getElementById('dice-roll-button');

function farkleRoll() {
  diceRollButton.disabled = true;
  if (diceRolls > 0 && rollRemaining == true) {
    for (let curDice = 0; curDice < 6; curDice++) {
      document.getElementsByClassName('dice')[curDice].classList.remove('spin-grow');
    }
    diceValues = [];
  }
  for (var currentDice = 0; currentDice < 6; currentDice++) {
    let currentDiceElement = document.getElementsByClassName('dice')[currentDice];
    diceValues.push(new Dice(roll(), currentDiceElement));
    currentDiceElement.src = diceValues[currentDice].imgSrc;
    setTimeout(function() {animateDice();}, 50);
    // let holdCurrentDice = document.getElementById('hold' + currentDice);
    // currentDiceElement.classList.add('interactive-img');
    // holdCurrentDice.classList.add('text-opacity');
  }
  diceRolls++;
  setTimeout(function() {diceRollButton.disabled = false;}, 200);
}

class Dice {
  constructor(numValue, currentDice) {
    this.numValue = numValue;
    this.imgSrc = 'images/' + numValue + 'dice.png';
    this.isHeld = false;
  }
}

function roll() {
  return Math.floor((Math.random() * 6) + 1);
}

function animateDice() {
  let diceElements = document.getElementsByClassName('dice');
  for (let i=0; i<diceElements.length; i++) {
    diceElements[i].classList.add('spin-grow');
  }
}