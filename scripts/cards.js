var handsDealt = 0;
var cards = [];
var cards2 = [];

function getCards() {
  // let list = document.getElementsByClassName("cards");
  // for(let i = list.length - 1; 0 <= i; i--)
  // if(list[i] && list[i].parentElement)
  // list[i].parentElement.removeChild(list[i]);
  document.getElementById("game-over-heading").style.display = "none";
  let cardImages = document.getElementsByClassName("card-slot-div");
  for (let i=0; i < cardImages.length; i++){
  while (cardImages[i].hasChildNodes()) {
    cardImages[i].removeChild(cardImages[i].lastChild);
    }
  }
  if (handsDealt >= 2)
  {
    handsDealt = 0;
  }
  function getRandomCardValues() { //for calculating the values of each card
    let randomValues = [Math.floor((Math.random()*13)+1),Math.floor((Math.random()*4)+1)];
    return randomValues;
  }
  for (let currentCard=0; currentCard<5; currentCard++){
    if (handsDealt==0)
    {
        let isSameIdentity=true;
        while (isSameIdentity===true)
        {
          if (currentCard === 0)
          {
            isSameIdentity=false;
          }
          currentValues = getRandomCardValues();
          numValue = currentValues[0]; //13 card value options excluding jokers. 1=ace, 11=jack, 12=queen, 13=king
          numSuit = currentValues[1]; //4 card suit options excluding jokers. club,diamond,heart,spade
          identity = numValue+"-"+numSuit;
          if (cards.filter(x => (x.identity === identity)).length === 0){
            isSameIdentity=false;
          }
        }
    cards.push(new Card(numValue,numSuit,identity));
    let cardImage = document.createElement("img");
    cardImage.className ="cards img-fluid";
    cardImage.src = cards[currentCard].imgSrc;
    cardImage.setAttribute("id", "card"+currentCard);
    cardImage.addEventListener("click", function(){toggleCardHold("hold"+currentCard);});
    document.getElementsByClassName('card-slot-div')[currentCard].appendChild(cardImage);
    let cardHold = document.createElement("figcaption");
    cardHold.className ="hold-card-text";
    cardHold.setAttribute("id", "hold"+currentCard)
    document.getElementsByClassName('card-slot-div')[currentCard].appendChild(cardHold);
    document.getElementById("card-deal-button").innerText = "Redeal Cards";
    }
    else if (handsDealt==1)
    {
      let isSameIdentity=true;
      while (isSameIdentity===true)
      {
        currentValues = getRandomCardValues();
        numValue = currentValues[0]; //13 card value options excluding jokers. 1=ace, 11=jack, 12=queen, 13=king
        numSuit = currentValues[1]; //4 card suit options excluding jokers. club,diamond,heart,spade
        identity = numValue+"-"+numSuit;
        if (cards.filter(x => (x.identity === identity)).length === 0){
          isSameIdentity=false;
          if (currentCard === 0)
          {
            isSameIdentity=false;
          }
          else if (cards2.filter(x => (x.identity === identity)).length === 0){
            isSameIdentity=false;
          }
        }
      }
      if (cards[currentCard].isHeld == true)
      {
        cards2.push(new Card(cards[currentCard].numValue,cards[currentCard].numSuit,cards[currentCard].identity));
        // cards2[currentCard] = Object.assign(cards[currentCard], cards2[currentCard]);
      }
      else {
        cards2.push(new Card(numValue,numSuit,identity));
      }
        let cardImage = document.createElement("img");
        cardImage.className ="cards img-fluid";
        cardImage.src = cards2[currentCard].imgSrc;
        cardImage.setAttribute("id", "card"+currentCard);
        document.getElementsByClassName('card-slot-div')[currentCard].appendChild(cardImage);
        document.getElementById("card-deal-button").innerText = "Play Again";
        if (currentCard == 4) {
          cards = [];
          cards2 = [];
          // let gameOver = document.createElement("h3");
          // gameOver.setAttribute("id", "game-over-heading");
          // document.getElementById("cards-container").appendChild(gameOver);
          // gameOver.innerHTML = "Game Over";\
          document.getElementById("game-over-heading").style.display = "block";
        }
    }
  }
  handsDealt++;
}

function Card(numValue,numSuit,identity) {
  this.numValue = numValue;
  this.numSuit = numSuit;
  this.identity = identity;
  this.imgSrc = "assets/images/cards/"+this.identity+".png";
  this.isRoyal = isRoyal(this.numValue);
  this.isJackOrBetter = isJackOrBetter(this.numValue);
  this.valueName = getValueName(this.numValue);
  this.suitName = getSuitName(this.numSuit);
  this.isHeld = false;
}

function toggleCardHold(currentHoldElement) {
  if (handsDealt == 1)
  {
    holdElement = document.getElementById(currentHoldElement);
    holdElement.innerText=="HOLD" ? holdElement.innerText = "" : holdElement.innerText = "HOLD";
    // alert(holdElement.parentElement.id);
    // let cardNum = parseInt(currentHoldElement.replace(/hold-/,""));
    let cardNum = parseInt(currentHoldElement.replace(/hold/,""));
    cards[cardNum].isHeld != true ? cards[cardNum].isHeld = true : cards[cardNum].isHeld = false;
  }
  else {
    return;
  }
}

function isRoyal(value) {
  if (value == 1 || value == 10 || value == 11 || value == 12 || value == 13)
  {return true} else {return false}
}
function isJackOrBetter(value) {
  if (value == 1 || value == 11 || value == 12 || value == 13)
  {return true} else {return false}
}
function getValueName(value) {
  return value==1 ? "one" : value==2 ? "two" : value==3 ? "three" : value==4 ? "four" :
  value==5 ? "five" : value==6 ? "six" : value==7 ? "seven": value==8 ? "eight" :
  value==9 ? "nine" : value==10 ? "ten" : value==11 ? "jack" : value==12 ? "queen" : "king";
}
function getSuitName(value) {
  return (value==1)?"clubs":(value==2)?"diamonds":(value==3)?"hearts":"spades";
}

// function isEqual(v1, v2)
// {
//   if (v1 == v2)
//   {return true} else {return false}
// }
// function isSameIdentity(currentObject, index, arr) {
//   if (index === 0)
//   {return false;}
//   else {return (currentObject.identity === arr[index - 1].identity);}
// }
