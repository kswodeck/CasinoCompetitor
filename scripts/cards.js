var handsDealt = 0;
var rankAchieved = false;
var cards = [];
var cards2 = [];

function getCards() {
  document.getElementById("hand-ranking-heading").style.display = "none";
    var cardImages = document.getElementsByClassName("cards");
    while(cardImages.length > 0){
        cardImages[0].parentNode.removeChild(cardImages[0]);
    }

  if (handsDealt >= 3)
  {
    handsDealt = 0;
  }
  function getRandomCardValues() { //for calculating the values of each card
    let randomValues = [Math.floor((Math.random()*13)+1),Math.floor((Math.random()*4)+1)];
    return randomValues;
  }
  for (let currentCard=0; currentCard<5; currentCard++){
    if (handsDealt===0)
    {
      document.getElementById("hold"+currentCard).style.opacity = 0.0001;
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
    let cardImage = createCardElement(cards[currentCard].imgSrc, currentCard);
    cardImage.addEventListener("click", function(){toggleCardHold("hold"+currentCard);});
    document.getElementById("card-deal-button").innerText = "Redeal Cards";
    }
    else if (handsDealt==1)
    {
      document.getElementById("hold"+currentCard).style.opacity = 0.0001;
      let isSameIdentity=true;
      while (isSameIdentity===true)
      {
        currentValues = getRandomCardValues();
        numValue = currentValues[0]; //13 card value options excluding jokers. 1=ace, 11=jack, 12=queen, 13=king
        numSuit = currentValues[1]; //4 card suit options excluding jokers. club,diamond,heart,spade
        identity = numValue+"-"+numSuit;
        if (cards.filter(x => (x.identity === identity)).length === 0){
          if (currentCard === 0)
          {
            isSameIdentity=false;
          }
          else if (cards2.filter(y => (y.identity === identity)).length === 0){
            isSameIdentity=false;
          }
        }
      }
      if (cards[currentCard].isHeld === true)
      {
        cards2.push(new Card(cards[currentCard].numValue,cards[currentCard].numSuit,cards[currentCard].identity));
      }
      else {
        cards2.push(new Card(numValue,numSuit,identity));
      }
        createCardElement(cards2[currentCard].imgSrc, currentCard);
        document.getElementById("card-deal-button").innerText = "Play Again";
        if (currentCard == 4) {
          cards = [];
          cards2 = [];
          if (rankAchieved === true)
          {
            // document.getElementById("hand-ranking-heading").style.color = "darkblue"; if a hand category has been acheived, blue text
          }
          else
          {
            // document.getElementById("hand-ranking-heading").style.color = "crimson"; if no hand categories have been acheived, red text
          }
          document.getElementById("hand-ranking-heading").style.display = "block";
        }
    }
    else
    {
      document.getElementById("hold"+currentCard).style.opacity = 0.0001;
      createCardElement("assets/images/cards/card_standard_blue_back.png", currentCard);
      document.getElementById("card-deal-button").innerText = "Deal Cards";
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

function createCardElement(imgUrl, currentCard){
  let cardImage = document.createElement("img");
  cardImage.className ="cards img-fluid";
  cardImage.src = imgUrl;
  cardImage.setAttribute("id", "card"+currentCard);
  document.getElementsByClassName('card-slot-div')[currentCard].appendChild(cardImage);
  return cardImage;
}

function toggleCardHold(currentHoldElement) {
  if (handsDealt == 1)
  {
    holdElement = document.getElementById(currentHoldElement);
    holdElement.style.opacity != 1 ? holdElement.style.opacity = 1 : holdElement.style.opacity = 0.0001;
    let cardNum = parseInt(currentHoldElement.replace(/hold/,""));
    cards[cardNum].isHeld !== true ? cards[cardNum].isHeld = true : cards[cardNum].isHeld = false;
    let holdCount = 0;
    for (let i=0; i<5; i++){
      if (cards[i].isHeld == true){
        holdCount++;
      }
    }
    if (holdCount >= 4){
      document.getElementById("card-deal-button").innerText = "Hold Cards";
    }
    else {
      document.getElementById("card-deal-button").innerText = "Redeal Cards";
    }
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
  if (value == 1 || value == 11 || value == 12 || value == 13) {
    return true;
  }
  else {
    return false;
  }
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
