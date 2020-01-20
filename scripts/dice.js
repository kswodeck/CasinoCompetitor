var ones_wins = [], twos_wins = [], threes_wins = [], fours_wins = [], fives_wins = [], sixes_wins = []; //total results arrays declared. Has to be delcared outside of functions so they can keep incrementing globally
document.getElementById("one_win").innerText = ones_wins.length; document.getElementById("two_win").innerText = twos_wins.length;
document.getElementById("three_win").innerText = threes_wins.length; document.getElementById("four_win").innerText = fours_wins.length;
document.getElementById("five_win").innerText = fives_wins.length; document.getElementById("six_win").innerText = sixes_wins.length;
function diceRoll() {
  let node1 = document.getElementById("dice-roll-div"); // node2 = document.getElementById("winner-div");
  while (node1.hasChildNodes()) {
    node1.removeChild(node1.lastChild);
  }
  // while (node2.hasChildNodes()) {
  //   node2.removeChild(node2.lastChild);
  // }
  let form = document.getElementById("diceform");
  var dice_quantity = form.elements.dicequantity.value;
  function roll(){
    return Math.floor((Math.random()*6)+1);
  }
    for (let i=0; i<dice_quantity; i++)
    {
      var result = roll();
      if (result == 1){
        let dice = "one";
        createDice(dice,i);
        one_win = ones_wins.push(result);
        document.getElementById("one_win").innerText = one_win;
      }
      else if (result == 2) {
        let dice = "two";
        createDice(dice,i);
        two_win = `${twos_wins.push(result)}`;
        document.getElementById("two_win").innerText = two_win;
      }
      else if (result == 3) {
        let dice = "three";
        createDice(dice,i);
        three_win = `${threes_wins.push(result)}`;
        document.getElementById("three_win").innerText = three_win;
      }
      else if (result == 4) {
        let dice = "four";
        createDice(dice,i);
        four_win = `${fours_wins.push(result)}`;
        document.getElementById("four_win").innerText = four_win;
      }
      else if (result == 5) {
        let dice = "five";
        createDice(dice,i);
        five_win = `${fives_wins.push(result)}`;
        document.getElementById("five_win").innerText = five_win;
      }
      else if (result == 6) {
        let dice = "six";
        createDice(dice,i);
        six_win = `${sixes_wins.push(result)}`;
        document.getElementById("six_win").innerText = six_win;
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
  document.getElementById("current-tally-heading").innerText = "Current Tally";
  document.getElementById("current-ones-tally").innerText = "Ones: "; document.getElementById("current-twos-tally").innerText = "Twos: ";
  document.getElementById("current-threes-tally").innerText = "Threes: "; document.getElementById("current-fours-tally").innerText = "Fours: ";
  document.getElementById("current-fives-tally").innerText = "Fives: "; document.getElementById("current-sixes-tally").innerText = "Sixes: ";
  document.getElementById("dice-roll-tally-div").style.display = "block";
  document.getElementById("tally-heading").innerText = "Tally";
  document.getElementById("ones-tally").innerText = "Ones: "; document.getElementById("twos-tally").innerText = "Twos: ";
  document.getElementById("threes-tally").innerText = "Threes: "; document.getElementById("fours-tally").innerText = "Fours: ";
  document.getElementById("fives-tally").innerText = "Fives: "; document.getElementById("sixes-tally").innerText = "Sixes: ";
}

function createDice(dice,i){
  let img = document.createElement("img");
  img.className ="dice img-fluid";
  img.setAttribute("id", "dice"+i);
  img.src = "assets/images/"+dice+"dice.png";
  let source = document.getElementById("dice-roll-div");
  source.appendChild(img);
  // let text = document.createElement("span");
  // text.className ="winner";
  // text.innerText = dice;
  // div = document.getElementById("winner-div");
  // div.appendChild(text);
}

function clearTally() {
  ones_wins = [], twos_wins = [], threes_wins = [], fours_wins = [], fives_wins = [], sixes_wins = [];
  document.getElementById("one_win").innerText = ones_wins.length; document.getElementById("two_win").innerText = twos_wins.length;
  document.getElementById("three_win").innerText = threes_wins.length; document.getElementById("four_win").innerText = fours_wins.length;
  document.getElementById("five_win").innerText = fives_wins.length; document.getElementById("six_win").innerText = sixes_wins.length;
}
