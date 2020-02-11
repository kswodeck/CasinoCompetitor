var handsDealt = 0;
var cards = [];
var cards2 = [];
var totalCoins = 100;
var currentBet = 1;
document.getElementById("total-coins-span").innerText = totalCoins;

function getCards() {
  if (totalCoins<=0 && handsDealt != 1 && handsDealt != 2){
    outOfCoinsDialog();
    handsDealt=2;
  }
  var currentHand = 0;
  document.getElementById("card-deal-button").setAttribute('disabled', 'disabled');
  document.getElementById("current-win-span").innerText = 0;
  document.getElementById("hand-ranking-heading").style.display = "none";
    var cardImages = document.getElementsByClassName("cards");
    while(cardImages.length > 0){
        cardImages[0].parentNode.removeChild(cardImages[0]);
    }
    document.getElementById("win-button").style.backgroundColor="crimson";
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
          numValue = currentValues[0]; //13 card value options: 1=ace, 11=jack, 12=queen, 13=king
          numSuit = currentValues[1]; //4 card suit options: club,diamond,heart,spade
          identity = numValue+"-"+numSuit;
          if (cards.filter(x => (x.identity === identity)).length === 0){
            isSameIdentity=false;
          }
        }
    cards.push(new Card(numValue,numSuit,identity));
    let cardImage = createCardElement(cards[currentCard].imgSrc, currentCard);
    cardImage.addEventListener("click", function(){toggleCardHold("hold"+currentCard);});
    document.getElementById("bet-button").setAttribute('disabled', 'disabled');
    }
    else if (handsDealt==1)
    {
      currentHand = cards2;
      document.getElementById("hold"+currentCard).style.opacity = 0.0001;
      let isSameIdentity=true;
      while (isSameIdentity===true)
      {
        currentValues = getRandomCardValues();
        numValue = currentValues[0]; //13 card value options: 1=ace, 11=jack, 12=queen, 13=king
        numSuit = currentValues[1]; //4 card suit options: club,diamond,heart,spade
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
      if (cards[currentCard].isHeld===true)
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
      document.getElementById("card-deal-button").removeAttribute("disabled");
      document.getElementById("bet-button").removeAttribute("disabled");
    }
  }
  if (handsDealt==0){
    totalCoins=totalCoins-currentBet;
    document.getElementById("total-coins-span").innerText = totalCoins;
  }
  if (handsDealt<2)
  {
    let handResultText = getHandRanking(currentHand);
    document.getElementById("hand-ranking-heading").innerText = handResultText;
    if (handResultText=="Game Over")
    {
      document.getElementById("hand-ranking-heading").style.color = "crimson"; // if no hand category has been acheived, red text
    }
    else
    {
    document.getElementById("hand-ranking-heading").style.display = "block";
    document.getElementById("hand-ranking-heading").style.color = "darkblue"; // if a hand category has been acheived, blue text
      if(handsDealt==1){
        collectCoins(handResultText);
      }
    }
  }
  handsDealt++;
  if (totalCoins-currentBet < 0  && handsDealt != 1 && handsDealt != 2) {
    while (totalCoins - currentBet < 0 && currentBet !=1) {
    currentBet--;
  }
    document.getElementById("current-bet-span").innerText = currentBet;
    }
  document.getElementById("card-deal-button").removeAttribute("disabled");
}

function Card(numValue,numSuit,identity){
  this.numValue = numValue;
  this.numSuit = numSuit;
  this.identity = identity;
  this.imgSrc = "assets/images/cards/"+this.identity+".png";
  this.isRoyal = isRoyal(this.numValue);
  this.isJackOrBetter = isJackOrBetter(this.numValue);
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

function isEqual(v1, v2)
{
  if (v1 == v2)
  {return true} else {return false}
}

function getHandRanking(hand){
  let isFlush = isFlushHand(hand);
  let isRoyal = isRoyalHand(hand);
  let isStraight = isStraightHand(hand[0].numValue,hand[1].numValue,hand[2].numValue,hand[3].numValue,hand[4].numValue);
  let highestSameKindCount = classifySameKinds(hand);
  let isPair = pairExists(hand);
        if (isFlush===true){ //determine if flush (royal, straight, normal)
          isJackOrBetterHand = false;
          if (isRoyal===true) //determine if royal flush
          {
            alert("Royal Flush"); //working
            return "Royal Flush";
          }
          else if (isStraight===true){ //determine if straight flush, not royal. Need each card to be 1 apart
            alert("Straight Flush"); //working
            return "Straight Flush";
          }
          else { //hand is a normal flush
            return "Flush";
          }
        }
        else if (isRoyal===true && highestSameKindCount==1){ //determines if hand is a Royal Straight (of different suits)
          alert("Straight"); //working
          return "Straight";
        }
        else if (isStraight===true){ //determines if hand is normal straight
          alert("Straight"); //working
          return "Straight";
        }
        else if (highestSameKindCount == 4){
          alert("4 of a Kind"); //working
          return "4 of a Kind";
        }
        else if (highestSameKindCount == 3){
          if (isPair===true){
            return "Full House";
          }
          else {
            return "3 of a Kind";
          }
        }
        else if (isTwoPairHand(hand)===true){
          return "Two Pair";
          }
        else if (isJackOrBetterHand(hand)===true){
          return "Jacks or Better";
        }
        else {
          return "Game Over";
        }
}

function isFlushHand(hand){
  if (isEqual(hand[0].numSuit,hand[1].numSuit) && isEqual(hand[1].numSuit,hand[2].numSuit)
  && isEqual(hand[2].numSuit,hand[3].numSuit) && isEqual(hand[3].numSuit,hand[4].numSuit))
  {
    return true;
  }
  return false;
}

function isStraightHand(v0,v1,v2,v3,v4){
  let compArray = [v0,v1,v2,v3,v4];
  let minNum = Math.min(v0,v1,v2,v3,v4);
  if (compArray.includes(minNum+1) && compArray.includes(minNum+2) && compArray.includes(minNum+3) && compArray.includes(minNum+4))
  {
    return true;
  }
  return false;
}

function isRoyalHand(hand){
  if (hand[0].isRoyal==true && hand[1].isRoyal==true &&
     hand[2].isRoyal==true && hand[3].isRoyal==true && hand[4].isRoyal==true)
  {
    return true;
  }
  return false;
}

function classifySameKinds(hand){
  for (let i=0;i<5;i++){
  currentKindCount = 1; //make sameKindCount a property of each card object, track which cards have matches
    for (let j=4;j>=0;j--){ //make hasPair a property of each card object only if that card's currentKindCount == 2
     if (hand[i] != hand[j]){
        if (hand[i].numValue == hand[j].numValue){
          currentKindCount++;
        }
      }
    }
   hand[i].sameKindCount = currentKindCount;
   if (currentKindCount==2){
     hand[i].hasPair = true;
     if (hand[i].isJackOrBetter==true){
       hand[i].isJackOrBetterPair = true;
     }
     else {
       hand[i].isJackOrBetterPair = false;
     }
   }
   else {
     hand[i].hasPair = false;
   }
  }
  return Math.max(hand[0].sameKindCount,hand[1].sameKindCount,hand[2].sameKindCount,hand[3].sameKindCount,hand[4].sameKindCount);
}

function pairExists(hand){
  for (let i=0;i<5;i++){
    if (hand[i].hasPair == true){
      return true;
    }
  }
  return false;
}

function isTwoPairHand(hand){
  let numPairs = 0;
  for (let i=0;i<5;i++){
    if (hand[i].hasPair == true){
      numPairs++;
    }
  }
  if (numPairs==4)
  {
    return true;
  }
  return false;
}

function isJackOrBetterHand(hand){
  for (let i=0;i<5;i++){
    if (hand[i].isJackOrBetterPair == true){
      return true;
    }
  }
  return false;
}

function toggleBet() {
  if (handsDealt==0 || handsDealt==3){
    if (totalCoins-currentBet <= 0){
      currentBet = 1;
    }
    else if (currentBet < 5)
    {
      currentBet++;
    }
    else {
      currentBet = 1;
    }
  document.getElementById("current-bet-span").innerText = currentBet;
  }
  else {
    return;
  }
}

function collectCoins(result){
  let currentWin=0;
  if(result=="Jacks or Better"){
   currentWin=currentBet;
   winCoinsDialog(currentWin,result);
  }
  else if(result=="Two Pair"){
    currentWin=currentBet*2;
    winCoinsDialog(currentWin,result);
  }
  else if(result=="3 of a Kind") {
    currentWin=currentBet*3;
    winCoinsDialog(currentWin,result);
  }
  else if (result == "Straight") {
    currentWin = currentBet*4;
    winCoinsDialog(currentWin,result);
  }
  else if (result == "Flush") {
    currentWin = currentBet*6;
    winCoinsDialog(currentWin,result);
  }
  else if (result == "Full House") {
    currentWin = currentBet*9;
    winCoinsDialog(currentWin,result);
  }
  else if (result == "4 of a Kind") {
    currentWin = currentBet*25;
    winCoinsDialog(currentWin,result);
  }
  else if (result == "Straight Flush") {
    currentWin = currentBet*50;
    winCoinsDialog(currentWin,result);
  }
  else if (result == "Royal Flush") {
    if (currentBet<5){
      currentWin = currentBet*250;
      winCoinsDialog(currentWin,result);
    }
    else {
      result = "Game Over";
      currentWin = 4000;
      winCoinsDialog(currentWin,result);
    }
  }
  totalCoins = totalCoins + currentWin;
  document.getElementById("win-button").style.backgroundColor="darkblue";
  document.getElementById("total-coins-span").innerText = totalCoins;
  document.getElementById("current-win-span").innerText = currentWin;
}

function outOfCoinsDialog(){
let outOfCoinsDialog = document.getElementById('outOfCoinsDialog');
let confirmBtn = document.getElementById('confirmBtn');
  if (typeof outOfCoinsDialog.showModal === "function") {
    outOfCoinsDialog.showModal();
  } else {
    alert("The <dialog> API is not supported by this browser");
  }
  document.getElementById('outOfCoinsCancel').onclick = function() {
    outOfCoinsDialog.close();
  }
}

function winCoinsDialog(currentWin,result) {
  let coinsDialog = document.getElementById('winCoinsDialog');
    if (typeof coinsDialog.showModal === "function") {
      document.getElementById('coin-win-popup-span').innerText = result;
      document.getElementById('number-coins-won').innerText = " "+currentWin+" ";
      coinsDialog.showModal();
      setTimeout(function(){ coinsDialog.close() }, 3500);
    } else {
      alert("The <dialog> API is not supported by this browser");
    }
    document.getElementById('winCoinsCancel').onclick = function() {
      coinsDialog.close();
    }
}
