var handsDealt = 0;
var cards = [];
var cards2 = [];
var currentHand = cards;
var rankAchieved = false;

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
    // let first = 10;
    if (handsDealt===0)
    {
      currentHand = cards;
      document.getElementById("hold"+currentCard).style.opacity = 0.0001;
      let isSameIdentity=true;
      while (isSameIdentity===true)
        {
          if (currentCard === 0)
          {
            isSameIdentity=false;
          }
          currentValues = getRandomCardValues();
          // if (currentCard==0){
          //   currentValues = [1,3];
          // }
          // else {
          //   currentValues = [first,3];
          // }
          numValue = currentValues[0]; //13 card value options excluding jokers. 1=ace, 11=jack, 12=queen, 13=king
          numSuit = currentValues[1]; //4 card suit options excluding jokers. club,diamond,heart,spade
          // first++;
          identity = numValue+"-"+numSuit;
          if (cards.filter(x => (x.identity === identity)).length === 0){
            isSameIdentity=false;
          }
        }
    cards.push(new Card(numValue,numSuit,identity));
    let cardImage = createCardElement(cards[currentCard].imgSrc, currentCard);
    cardImage.addEventListener("click", function(){toggleCardHold("hold"+currentCard);});
    }
    else if (handsDealt==1)
    {
      currentHand = cards2;
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
  if (handsDealt==0 || handsDealt==1)
  {
    if (rankAchieved === true)
    {
      document.getElementById("hand-ranking-heading").innerText = getHandRanking(currentHand);
      document.getElementById("hand-ranking-heading").style.color = "darkblue"; // if a hand category has been acheived, blue text
    }
    else
    {
      document.getElementById("hand-ranking-heading").innerText = "Game Over";
      document.getElementById("hand-ranking-heading").style.color = "crimson"; // if no hand categories have been acheived, red text
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
  this.numValuesMatching = 0;
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

function isEqual(v1, v2)
{
  if (v1 == v2)
  {return true} else {return false}
}

function getHandRanking(hand){
  let isFlush = isFlushHand(hand);
  let isRoyal = isRoyalHand(hand);
  let isStraight = isStraightHand(hand[0].numValue,hand[1].numValue,hand[2].numValue,hand[3].numValue,hand[4].numValue);
  let highestSameKindCount = getSameKindCount(hand);
  let isJackOrBetterHand = true;
  let isFullHouse = false;
        if (isFlush==true){ //conditional to determine flush (royal, straight, normal)
          rankAchieved = true;
          isJackOrBetterHand = false;
          if (isRoyal==true) //determines if royal flush
          {
            alert("Royal Flush"); //working
            return "Royal Flush";
          }
          else if (isStraight==true){ //determines if straight flush, not royal. Difficult to determine. Need each card to be 1 apart
            alert("Straight Flush"); //working
            return "Straight Flush";
          }
          else { //hand is a normal flush
            alert("Flush"); //working
            return "Flush";
          }
        }
        else if (isRoyal==true){ //determines if hand is a Royal Straight (of different suits)
          alert("Straight"); //working
          return "Straight";
        }
        else if (isStraight==true){ //determines if hand is normal straight
          alert("Straight"); //working
          return "Straight";
        }
}

function isFlushHand(hand){
  // let sameSuitCount = 0;
  // let isFlush = currentHand.every(isEqual(currentHand[0].numSuit))
  if (isEqual(hand[0].numSuit,hand[1].numSuit) && isEqual(hand[1].numSuit,hand[2].numSuit)
  && isEqual(hand[2].numSuit,hand[3].numSuit) && isEqual(hand[3].numSuit,hand[4].numSuit))
  {
    return true;
  }
  else {
    {
      return false;
    }
  }
}

function isStraightHand(v0,v1,v2,v3,v4){
  let compArray = [v0,v1,v2,v3,v4];
  let minNum = Math.min(v0,v1,v2,v3,v4);
    if (compArray.includes(minNum+1) && compArray.includes(minNum+2) && compArray.includes(minNum+3) && compArray.includes(minNum+4))
    {
      return true;
    }
    else
    {
      return false;
    }
}

function isRoyalHand(hand){
  if (hand[0].isRoyal==true && hand[1].isRoyal==true &&
     hand[2].isRoyal==true && hand[3].isRoyal==true && hand[4].isRoyal==true)
  {
    return true;
  }
  else {
    {
      return false;
    }
  }
}

function getSameKindCount(hand){
  for (let i=0;i<5;i++){
  let currentKindCount = 1; //make sameKindCount a property of each card object, track which cards have matches
   for (let j=4;j>=0;j--){
    
   }
   hand[i].sameKindCount = currentKindCount;
  }
  return 1;
}
