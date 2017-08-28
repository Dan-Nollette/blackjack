//BACKEND SCRIPTS (business logic)

  //The ranks of cards in a deck and their corresponding values in blackjack.
var ranks = [["2", 2], ["3", 3], ["4", 4], ["5", 5], ["6", 6], ["7", 7], ["8", 8], ["9", 9], ["10", 10], ["j", 10], ["q", 10], ["k", 10], ["a", 11]];

  //The suits of cards in a deck.
var suits = [["spades", "♠"], ["hearts", "♥"], ["clubs", "♣"], ["diams", "♦"]];
  //["♠", "♥", "♣", "♦"];
  // BankRoll is the amount of money the player has available to wager.
var playerBankRoll = 1000;

  // The current shoe object in use.
var currentShoe;
  // The player's hand of cards
var playerHand;
  // The Dealer's hand of cards
var dealerHand;

  //The Card object has a rank and suit, just as a real playing card would. 'Shuffle score' is used to randomize the cards for shuffling. deckNumber tracks which deck the card cam from for multiple deck shoes. 'value' tracks the value of the card with aces counted as 11.
function Card(rank, suit, suitSymbol, value, number){
  this.rank = rank;
  this.suit = suit;
  this.suitSymbol = suitSymbol;
  this.value = value;
  this.deckNumber = number;
  this.shuffleScore;
};

  // Individualshand contains an array cards, the score is their combined value, and the number of aces for tracking hard, vs. soft hands. 'Wager' is the number of points the player has bet on this round.
function IndividualHand(){
  this.cards = [];
  this.hardScore = 0;
  this.softScore = 0;
  this.wager = 10;
}

  //checks if a hand is busted
IndividualHand.prototype.isBust = function(){
  if (this.hardScore > 21) {
    return true;
  } else {
    return false;
  }
}

  //determines whether the dealer will hit or stay
var hitOrStay = function(hand){
  for(; hand.softScore < 17;){
    currentShoe.dealCard(hand);
  }
}


  // The shoe object represents all cards in the decks being played. remainingCards are the cards remaining to be dealt, dealtCards are those that have been dealt. redCard is the indicator for when a shuffle is required before the next round can be dealt. decks tracks the number of decks used to create this shoe.
function Shoe(decks){
  this.decks = decks;
  this.remainingCards = [];
  this.redCard = 26;
  this.dealtCards = [];
  var cardsArray = this.remainingCards;
  for (var i = 0; i < this.decks; i++){
    suits.forEach(function(suit){
      ranks.forEach(function(rank){
        cardsArray.push(new Card(rank[0], suit[0], suit[1], rank[1], i+1));
      })
    })
  }
}

  //Calling the Shoe.shuffle() method removes all cards from dealtCards and places them in remainingCards. It then randomizes the order of remainingCards.
Shoe.prototype.shuffle = function(){
  this.dealtCards.forEach(function(card){
    this.remainingCards.push(card);
  });
  this.dealtCards = [];
  this.remainingCards.forEach(function(card){
    card.shuffleScore = Math.random();
  });
  this.remainingCards.sort(function(a, b){
    return b.shuffleScore - a.shuffleScore;
  });
}

  //This method takes a card from remaining cards and adds it to the dealtCards and the hand parameter's cards array, updating hand.score as necessary.
Shoe.prototype.dealCard = function(hand){
  var currentCard = this.remainingCards.pop();
  hand.cards.push(currentCard);
  this.dealtCards.push(currentCard);
  hand.hardScore = hand.hardScore + currentCard.value;
}

//Deals two cards to the hand parameter
Shoe.prototype.dealHand = function(individual){
this.dealCard(individual);
this.dealCard(individual);
}

  //This deals cards to the player and dealer to begin the round, shuffling first if necessary.
Shoe.prototype.dealRound = function(player, dealer){
  if (this.redcard >= remainingCards.length){
    this.shuffle();
  }
  this.dealHand(player);
  this.dealHand(dealer);
}

// takes card as parameter and returns html tags to output for that card
Card.prototype.toHTML = function(){
  var rankToPresent = this.rank;
  console.log(this.rank + "  " + rankToPresent);
  if (this.rank ==='a' || this.rank ==='k' || this.rank ==='q' || this.rank ==='j') {
    rankToPresent = this.rank.toUpperCase();
  }
  console.log(this.rank + "  " + rankToPresent);
  var returnstring = "";
  returnstring += "<li>"
  returnstring += "\n\t<div class=\"card rank-" + this.rank + " " + this.suit + "\">";
  returnstring += "\n\t\t<span class=\"rank\">" + rankToPresent + "</span>";
  returnstring += "\n\t\t<span class=\"suit\">" + this.suitSymbol + "</span>";
  returnstring += "\n\t</div>";
  returnstring += "\n</li>"
  return returnstring;
};

//FRONTEND SCRIPTS (user interface logic)
$(document).ready(function(){

  //scripts for when the player clicks the 'Hit' button
  $(".hitButton").click(function(event){
      event.preventDefault();
      playerHand(dealCard);
      //output dealt card, indicate score, possible bust.
  });
  //scripts for when the player clicks the 'Stay' button
  $(".stayButton").click(function(event){
      event.preventDefault();
      hitOrStay(dealerHand);
      //userPlayer ends their turn. Trigger dealer Turn.
  });
  //scripts for when the player clicks the 'double' button
  // $("#doubleButton").click(function(event){
  //     event.preventDefault();
  //     var size = $("#sizes").val();
  //     var toppings = [];
  //     toppings = $(".pieOptions input:checkbox:checked").map(function(){
  //       return $(this).val();
  //     }).get();
  //     $("#output").show();
  //     $("#output").text(getPriceOutput(size, toppings));
  //});
  //scripts for when the player clicks the 'split' button
  // $("#splitButton").click(function(event){
  //     event.preventDefault();
  //     var size = $("#sizes").val();
  //     var toppings = [];
  //     toppings = $(".pieOptions input:checkbox:checked").map(function(){
  //       return $(this).val();
  //     }).get();
  //     $("#output").show();
  //     $("#output").text(getPriceOutput(size, toppings));
  // });

  //scripts for when the player clicks the 'New Game' button
  $(".newGameButton").click(function(event){
      event.preventDefault();
      currentShoe = new Shoe(1);
      playerHand =  new IndividualHand();
      dealerHand = new IndividualHand();
      // unhide necessary fields.
      playerBankRoll = 1000;
  });
  //scripts for when the player clicks the 'Shuffle' button. Note, this is only an option when the player is not in the middle of a hand.
  $(".shuffleButton").click(function(event){
      event.preventDefault();
      currentShoe.shuffle();
      //TO DO: output feedback to let user know the shoe is shuffled
  });
});



// // <li>
// //   <div class="card rank-a spades"><span class="rank">A</span><span class="suit">♠</span></div>
// // </li>
// <li>
//           <div class="card rank-a diams"><span class="rank">A</span><span class="suit">♦</span></div>
//         </li>
//         <li>
//         	<div class="card rank-a diamonds">
//         		<span class="rank">a</span>
//         		<span class="suit">♦</span>
//         	</div>
//         </li>
