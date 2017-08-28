//BACKEND SCRIPTS (business logic)

  //The ranks of cards in a deck and their corresponding values in blackjack.
var ranks = [["Deuce", 2], ["Three", 3], ["Four", 4], ["Five", 5], ["Six", 6], ["Seven", 7], ["Eight", 8], ["Nine", 9], ["Ten", 10], ["Jack", 10], ["Queen", 10], ["King", 10], ["Ace", 11]];

  //The suits of cards in a deck.
var suits = ["Spades", "Hearts", "Clubs", "Diamonds"];

  // BankRoll is the amount of money the player has available to wager.
var playerBankRoll = 1000;

  //The Card object has a rank and suit, just as a real playing card would. 'Shuffle score' is used to randomize the cards for shuffling. deckNumber tracks which deck the card cam from for multiple deck shoes. 'value' tracks the value of the card with aces counted as 11.
function Card(rank, suit, value, number){
  this.rank = rank;
  this.suit = suit;
  this.value = value;
  this.deckNumber = number;
  this.shuffleScore;
};

  // Individualshand contains an array cards, the score is their combined value, and the number of aces for tracking hard, vs. soft hands. 'Wager' is the number of points the player has bet on this round.
function IndividualHand(){
  this.cards = [];
  this.score = 0;
  this.aces = 0
  this.isSoft = false;
  this.wager = 10;
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
        cardsArray.push(new Card(rank[0], suit, rank[1], i+1));
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

  //This method takes a card from remaining cards and adds it to the dealtCards and the hand parameter's cards array, updating handScore as necessary.
Shoe.prototype.dealCard = function(hand){
  var currentCard = this.remainingCards.pop();
  hand.cards.push(currentCard);
  this.dealtCards.push(currentCard);
  hand.score = hand.score + currentCard.value;
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

//FRONTEND SCRIPTS (user interface logic)
$(document).ready(function(){
  var playerHand;
  var dealHand;
  //scripts for when the player clicks the 'Hit' button
  $("#hitButton").click(function(event){
      event.preventDefault();

      toppings = $(".pieOptions input:checkbox:checked").map(function(){
        return $(this).val();
      }).get();
      $("#output").show();
      $("#output").text(getPriceOutput(size, toppings));
  });
  //scripts for when the player clicks the 'Stay' button
  $("#stayButton").click(function(event){
      event.preventDefault();
      var size = $("#sizes").val();
      var toppings = [];
      toppings = $(".pieOptions input:checkbox:checked").map(function(){
        return $(this).val();
      }).get();
      $("#output").show();
      $("#output").text(getPriceOutput(size, toppings));
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
  $("#newGameButton").click(function(event){
      event.preventDefault();
      playerHand =  New IndividualHand();
      dealerHand = New IndividualHand();
      // unhide necessary fields.
      playerBankRoll = 1000;
      New Shoe(4);
  });
  //scripts for when the player clicks the 'Shuffle' button. Note, this is only an option when the player is not in the middle of a hand.
  $("#shuffleButton").click(function(event){
      event.preventDefault();
      var size = $("#sizes").val();
      var toppings = [];
      toppings = $(".pieOptions input:checkbox:checked").map(function(){
        return $(this).val();
      }).get();
      $("#output").show();
      $("#output").text(getPriceOutput(size, toppings));
  });
});
