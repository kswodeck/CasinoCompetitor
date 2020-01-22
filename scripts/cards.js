function getCards() {
  let cardImages = document.getElementsByClassName("card-slot-div");
  for (let i=0; i < cardImages.length; i++){
  while (cardImages[i].hasChildNodes()) {
    cardImages[i].removeChild(cardImages[i].lastChild);
    }
  }
  var cards = [];
  function getRandomCardValues() { //for calculating the values of each card
    let randomValues = [Math.floor((Math.random()*13)+1),Math.floor((Math.random()*4)+1)]
    return randomValues;
  }
  for (let currentCard=0; currentCard<5; currentCard++)
  {
    let currentValues = getRandomCardValues();
    let numValue = currentValues[0]; //13 card value options excluding jokers. 1=ace, 11=jack, 12=queen, 13=king
    let numSuit = currentValues[1]; //4 card suit options excluding jokers. club,diamond,heart,spade
    identity = numValue+"-"+numSuit;
    cards[currentCard] = new Card(numValue,numSuit,identity);
    cards.push(cards[currentCard]);
    let cardImage = document.createElement("img");
    cardImage.className ="cards";
    cardImage.src = cards[currentCard].imgSrc;
    document.getElementsByClassName('card-slot-div')[currentCard].appendChild(cardImage);
    cardImage.setAttribute("id", "card"+currentCard);
  }
}

function Card(numValue, numSuit, valueSuit) {
  this.numValue = numValue;
  this.numSuit = numSuit;
  this.identity = identity;
  this.imgSrc = "assets/images/cards/"+this.identity+".png";
}

// this.valueName = function () {
//   return this.numValue==1 ? "one" : this.numValue==2 ? "two" : this.numValue==3 ? "three" : this.numValue==4 ? "four" :
//   this.numValue==5 ? "five" : this.numValue==6 ? "six" : this.numValue==7 ? "seven": this.numValue==8 ? "eight" :
//   this.numValue==9 ? "nine" : this.numValue==10 ? "ten" : this.numValue==11 ? "jack" : this.numValue==12 ? "queen" : "king";
// };
// this.suitName = function () {
//   return (this.numSuit==1)?"club":(this.numSuit==2)?"diamond":(this.numSuit==3)?"heart":"spade";
// };
