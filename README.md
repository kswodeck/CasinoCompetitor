# GameChanger

Welcome to my project, currently called "Game Changer". This is a virtual casino type of web app where luck and chance is the calling card.
Features include a virtual coin flipper, virtual dice rolling (up to 20 dice) as well as virtual 5 card poker

Enhancements are still in progress, specifically for the virtual poker feature, which I am calling "Poker Partner"
Poker Partner has the functionalities of a standard video poker game, but also offers your own personalized poker trainer.
With strategy mode turn on, Poker Partner will evaluate the hand you are dealt and advise you on the best move(s) to make, which cards to hold, in order to acheive the highest win possible.
Poker Partner can also show you the percentages of winning each type of poker hand based on what cards you have held, ensuring that you understand the stakes before the final redeal is done.


Need to exclude 5 cards of the same value being present. To do this, we need to prevent each card from being both the same value and suit of another.. in other words, no card identity can be duplicated


Likelihood of Achieving Hand Categories

Royal Flush (Straight Flush)
If isFlush == true AND there is one of each: 10, jack (11), queen (12), king (13), and ace (1).. in other words, isRoyal == true for every card.. AND isStraight == true

Straight Flush
Not a royal flush. If isFlush == true AND isStraight == true

4 of a Kind
If any 4 cards numValues are equal

Full House
If sameValues == 3 and pairs == 1

Flush
Not a royal or straight flush. If (cards[1].numSuit == cards[2].numSuit AND cards[2].numSuit == cards[3].numSuit AND cards[3].numSuit == cards[4].numSuit AND cards[4].numSuit == cards[5].numSuit).. isFlush == true

Straight
Not a royal or straight flush. Find the lowest card. Check if there is a card that is equal to cards[i].numValue+1, then +2, +3, +4. In this case ace can be either at the beginning or the end. If an ace(1) exists.. in other words, if the lowest card isRoyal, try both incrementing from 1 or decrementing from 14.. isStraight == true

3 of a Kind
Not 4 of a kind or full house. If any 3 cards numValues are equal

Two Pairs
Not 4 or 3 of a kind or full house. If there are 2 pairs of cards numValues that are equal

Jacks or Better (not ordinary pairs)
Not 4 or 3 of a kind or full house or two pair. If two cards numValues are both jack (11), queen (12), king (13), or ace (1).. in other words, isJOrBetter == true for both equal cards


functions, booleans, and incrementing variables:
isFlush, isStraight (bool functions)
isRoyal, isJOrBetter (object functions assigned through object properties)
pairs, sameValues (incrementing globals)