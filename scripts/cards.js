var handsDealt = 0;
var cards = [];
var cards2 = [];
var totalCoins = 100;
var currentBet = 1;
document.getElementById("total-coins-span").innerText = totalCoins;

// eslint-disable-next-line no-unused-vars
function getCards() {
  function getRandomCardValues() { //for calculating the values of each card
    let currentValues = [Math.floor((Math.random()*13)+1),Math.floor((Math.random()*4)+1)];
    let numValue = currentValues[0]; //13 card value options excluding jokers. 1=ace, 11=jack, 12=queen, 13=king
    let numSuit = currentValues[1]; //4 card suit options excluding jokers. club,diamond,heart,spade
    currentValues.push(numValue+"-"+numSuit);
    return currentValues;
  }
  function Card(numValue,numSuit,identity){
    this.numValue = numValue;
    this.numSuit = numSuit;
    this.identity = identity;
    this.imgSrc = "assets/images/cards/"+this.identity+".png";
    this.isRoyal = isRoyal(this.numValue);
    this.isJackOrBetter = isJackOrBetter(this.numValue);
    this.isHeld = false;
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
  }
  function createCardElement(imgUrl, currentCard){
    let cardImage = document.createElement("img");
    cardImage.className ="cards img-fluid";
    cardImage.src = imgUrl;
    cardImage.setAttribute("id", "card"+currentCard);
    document.getElementsByClassName('card-slot-div')[currentCard].appendChild(cardImage);
    return cardImage;
  }
  function collectCoins(result){
    let currentWin=0;
    if(result=="Jacks or Better"){
     currentWin=currentBet;
    }
    else if(result=="Two Pair"){
      currentWin=currentBet*2;
    }
    else if(result=="3 of a Kind") {
      currentWin=currentBet*3;
    }
    else if (result == "Straight") {
      currentWin = currentBet*4;
    }
    else if (result == "Flush") {
      currentWin = currentBet*6;
    }
    else if (result == "Full House") {
      currentWin = currentBet*9;
    }
    else if (result == "4 of a Kind") {
      currentWin = currentBet*25;
    }
    else if (result == "Straight Flush") {
      currentWin = currentBet*50;
    }
    else if (result == "Royal Flush") {
      if (currentBet<5){
        currentWin = currentBet*250;
      }
      else {
        currentWin = 4000;
      }
    }
    totalCoins = totalCoins + currentWin;
    document.getElementById("win-button").style.backgroundColor="darkblue";
    document.getElementById("total-coins-span").innerText = totalCoins;
    document.getElementById("current-win-span").innerText = currentWin;
    winCoinsDialog(currentWin,result);
  }
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
  for (let currentCard=0; currentCard<5; currentCard++){
    let currentValues = 0;
    if (handsDealt===0)
    {
      currentHand = cards;
      document.getElementById("hold"+currentCard).style.opacity = 0.0001;
      let isSameIdentity=true;
      while (isSameIdentity===true)
        {
          if (currentCard===0)
          {
            isSameIdentity=false;
          }
          currentValues = getRandomCardValues();
          if (cards.filter(x => (x.identity === currentValues[2])).length === 0){
            isSameIdentity=false;
          }
        }
    cards.push(new Card(currentValues[0],currentValues[1],currentValues[2]));
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
        if (cards.filter(x => (x.identity === currentValues[2])).length === 0){
          if (currentCard === 0)
          {
            isSameIdentity=false;
          }
          else if (cards2.filter(y => (y.identity === currentValues[2])).length === 0){
            isSameIdentity=false;
          }
        }
      }
      if (cards[currentCard].isHeld===true)
      {
        cards2.push(new Card(cards[currentCard].numValue,cards[currentCard].numSuit,cards[currentCard].identity));
      }
      else {
        cards2.push(new Card(currentValues[0],currentValues[1],currentValues[2]));
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

function getHandRanking(hand) {
  let highestSameKindCount = classifySameKinds(hand);
  let isFlush = isFlushHand(hand);
  let isRoyal = isRoyalHand(hand);
  let isStraight = isStraightHand(hand[0].numValue, hand[1].numValue, hand[2].numValue, hand[3].numValue, hand[4].numValue);
  let result = "Game Over";
  if (isTwoPairHand(hand) === true) {
    result = "Two Pair";
  }
  else if (isJackOrBetterHand(hand) === true && highestSameKindCount == 2) {
    result = "Jacks or Better";
  }
  else if (highestSameKindCount == 3) {
    if (pairExists(hand) === true) {
      result = "Full House";
    }
    else {
      result = "3 of a Kind";
    }
  }
  else if (isStraight === true && isFlush === false) { //normal straight, not a royal straight/flush
    result = "Straight";
  }
  else if (highestSameKindCount == 4) {
    result = "4 of a Kind";
  }
  else if (isFlush === true) { //determine if flush (royal, straight, normal)
      if (isRoyal === true) //determine if royal flush
      {
        result = "Royal Flush";
      }
      else if (isStraight === true) { //determine if straight flush, not royal. Need each card to be 1 apart //working
        result = "Straight Flush";
      }
      else { //hand is a normal flush
        result = "Flush";
      }
    }
  return result;
  function isFlushHand(hand){
    if (hand[0].numSuit==hand[1].numSuit && hand[1].numSuit==hand[2].numSuit
    && hand[2].numSuit==hand[3].numSuit && hand[3].numSuit==hand[4].numSuit)
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
    else if (compArray.includes(10) && compArray.includes(11) && compArray.includes(12) && compArray.includes(13) && compArray.includes(1)){
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
    let currentKindCount = 1;
      for (let j=4;j>=0;j--){
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
}

function toggleCardHold(currentHoldElement) {
  if (handsDealt == 1)
  {
    let holdElement = document.getElementById(currentHoldElement);
    holdElement.style.opacity != 1 ? holdElement.style.opacity = 1 : holdElement.style.opacity = 0.0001;
    let cardNum = parseInt(currentHoldElement.replace(/hold/,""));
    cards[cardNum].isHeld !== true ? cards[cardNum].isHeld = true : cards[cardNum].isHeld = false;
    }
  else {
    return;
  }
}

// eslint-disable-next-line no-unused-vars
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

function outOfCoinsDialog(){
let outOfCoinsDialog = document.getElementById('outOfCoinsDialog');
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
      setTimeout(function(){ coinsDialog.close() }, 2500);
    } else {
      alert("The <dialog> API is not supported by this browser");
    }
    document.getElementById('winCoinsCancel').onclick = function() {
      coinsDialog.close();
    }
}
