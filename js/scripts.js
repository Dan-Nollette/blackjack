//BACKEND SCRIPTS (business logic)

gameInitialized = false;
  //The ranks of cards in a deck and their corresponding values in blackjack.
var ranks = [["2", 2], ["3", 3], ["4", 4], ["5", 5], ["6", 6], ["7", 7], ["8", 8], ["9", 9], ["10", 10], ["j", 10], ["q", 10], ["k", 10], ["a", 1]];
  //Tracks whether there is currently a hand being played
var handInPLay = false;
  //The suits of cards in a deck.
var suits = [["spades", "♠"], ["hearts", "♥"], ["clubs", "♣"], ["diams", "♦"]];
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
  this.containsAce = false;
  this.hardScore = 0;
  this.softScore = 0;
  this.wager = 25;
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
  for(; hand.hardScore < 17 && hand.softScore < 17;){
    currentShoe.dealCard(hand);
    $("#dealerHand").append(hand.cards[hand.cards.length -1].toHTML());
  }
}

var evaluateRound = function(dealerHand, playerHand) {
  handInPLay = false;
  var dealerFinalScore = dealerHand.finalScore();
  var playerFinalScore = playerHand.finalScore();
  if (dealerHand.isBust()) {
    playerBankRoll += playerHand.wager;
    $("#actionOutput").append(". Dealer is bust with a score of " + dealerHand.hardScore + ". You win! Your bankroll is now " + playerBankRoll);
    //return output for dealer bust. "Dealer is bust, you win!"
    //add wager to bankroll
  } else if (playerFinalScore > dealerFinalScore){
    playerBankRoll += playerHand.wager;
    $("#actionOutput").append(". You have " + playerFinalScore + " and the dealer has " + dealerFinalScore + " Congrats, you win. Your bankroll is now " + playerBankRoll);
    //return output for player beats dealer "
    //add wager to bankroll
  } else if (playerFinalScore === dealerFinalScore) {
    $("#actionOutput").append(". You have " + playerFinalScore + " and the dealer has " + dealerFinalScore + " it's a tie. Your bankroll is now " + playerBankRoll);
  } else if (playerFinalScore < dealerFinalScore) {
    playerBankRoll -= playerHand.wager;
    $("#actionOutput").append(". You have " + playerFinalScore + " and the dealer has " + dealerFinalScore + " Sorry, you loose. Your bankroll is now " + playerBankRoll);
    //return output for dealer beats player "sorry, you loose."
  }
}

IndividualHand.prototype.finalScore = function(){
  if (this.softScore > 21) {
    return this.hardScore;
  } else {
    return this.softScore;
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
  this.shuffle();
}

  //Calling the Shoe.shuffle() method removes all cards from dealtCards and places them in remainingCards. It then randomizes the order of remainingCards.
Shoe.prototype.shuffle = function(){
  alert("106")
  var remainingCardsPointer = this.remainingCards;
  this.dealtCards.forEach(function(card){
    remainingCardsPointer.push(card);
  });
  this.dealtCards = [];
  this.remainingCards.forEach(function(card){
    card.shuffleScore = Math.random();
  });
  this.remainingCards.sort(function(a, b){
    return b.shuffleScore - a.shuffleScore;
  });
}

  //This method takes a card from remaining cards and adds it to the dealtCards and the hand parameter's cards array, updating scores as necessary.
Shoe.prototype.dealCard = function(hand){
  var currentCard = this.remainingCards.pop();
  hand.cards.push(currentCard);
  if (currentCard.rank === 'a') {
    hand.containsAce = true;
  }
  this.dealtCards.push(currentCard);
  hand.hardScore = hand.hardScore + currentCard.value;
  hand.softScore = hand.hardScore;
  if (hand.hardScore < 12 && hand.containsAce){
    hand.softScore += 10;
  }
}

//Deals two cards to the hand parameter
Shoe.prototype.dealHand = function(individual){
  individual.cards = [];
  individual.containsAce = false;
  individual.hardScore = 0;
  individual.softScore = 0;
  individual.wager = 25;
  this.dealCard(individual);
  this.dealCard(individual);
}

  //This deals cards to the player and dealer to begin the round, shuffling first if necessary.
Shoe.prototype.dealRound = function(player, dealer, currentWager){
  alert(this.remainingCards.length)
  if (this.redCard >= this.remainingCards.length){
    this.shuffle();
  }
  this.dealHand(player);
  this.dealHand(dealer);
  player.wager = currentWager;
  if(dealer.softScore === 21) {
    handInPLay = false;
    if (player.softScore === 21) {
      alert("156");
      return "You and dealer both have blackjack. It's a tie.";
      //output something about you and dealer both getting blackjack, "it's a tie"
    } else {
      alert("160");
      playerBankRoll -= playerHand.wager;
      return "The dealer has Blackjack. Sorry, You lose.";
      //output something about dealer both getting blackjack, "sorry, you loose"
    }
  // display all cards dealt and prompt for starting  next hand
  }
  if (player.softScore === 21) {
    alert("168");
    handInPLay = false;
    playerBankRoll += (playerHand.wager * 1.5);
    return "You have blackjack!, congratulations, you get paid 3-2 on your bet."
    //output something about player getting blackjack, "Blackjack! you get paid 2-1!"
  } else {
    return "You have " + player.softScore +" and the dealer shows a " + dealer.cards[0].rank + ". click hit or stay."
  }
  //display player's cards, and a little message about the current score. prompt action.
}

// takes card as parameter and returns html tags to output for that card
Card.prototype.toHTML = function(){
  var returnstring = "";
  returnstring += "<li>"
  returnstring += "\n\t<div class=\"card rank-" + this.rank + " " + this.suit + "\">";
  returnstring += "\n\t\t<span class=\"rank\">" + (this.rank + "").toUpperCase() + "</span>";
  returnstring += "\n\t\t<span class=\"suit\">" + this.suitSymbol + "</span>";
  returnstring += "\n\t</div>";
  returnstring += "\n</li>"
  return returnstring;
};

//FRONTEND SCRIPTS (user interface logic)
$(document).ready(function(){

  $(".dealButton").click(function(event){
    event.preventDefault();
    if(gameInitialized) {
      if(!handInPLay){
        handInPLay = true;
        $("#playerHand").text("");
        $("#dealerHand").text("");
        var currentWager = parseInt($('input[name="bet"]:checked').val());
        var tempString = currentShoe.dealRound(playerHand, dealerHand, currentWager);
        $("#dealerHand").append("<li><element class=\"card back\">*</element></li>");
        $("#dealerHand").append(dealerHand.cards[0].toHTML());
        $("#playerHand").append(playerHand.cards[0].toHTML());
        $("#playerHand").append(playerHand.cards[1].toHTML());
        $("#actionOutput").text(tempString);// "You have " + playerHand.softScore +" and the dealer shows a " + dealerHand.cards[0].rank + ". click hit or stay.");
      } else {
        alert("There is currently a hand in play. You can't deal another until this one is over.");
      }
    }
    else {
      alert("You can't do that until you start the game. click the Play1 button to start.");
    }
  });

  //scripts for when the player clicks the 'Hit' button
  $(".hitButton").click(function(event){
    event.preventDefault();
    if(handInPLay){
      currentShoe.dealCard(playerHand);
      $("#playerHand").append(playerHand.cards[playerHand.cards.length -1].toHTML());
      $("#actionOutput").text("You took a hit. You now have " + playerHand.softScore);
      //output dealt card, indicate score.
      if (playerHand.isBust()){
        $("#actionOutput").append(". Sorry, you busted out");
        playerBankRoll -= playerHand.wager;
        handInPLay = false;
        //player Bust output
        //prompt beginning of new hand.
      } else {
        $("#actionOutput").append(". Click hit or stay");
      }
    } else {
        alert("There is currently no hand in play. You can't take a hit until you deal a hand");
    }
  });

  //scripts for when the player clicks the 'Stay' button
  $(".stayButton").click(function(event){
      event.preventDefault();
      if(handInPLay){
        $("#dealerHand").text("");
        $("#dealerHand").append(dealerHand.cards[0].toHTML());
        $("#dealerHand").append(dealerHand.cards[1].toHTML());
        $("#actionOutput").text("You stay on " + playerHand.softScore);
        //output something about the player standing. Maybe wait for user input before continueing.
        hitOrStay(dealerHand);
        evaluateRound(dealerHand, playerHand,);
      } else {
          alert("There is currently no hand in play. You can't take stay until you deal a hand");
      }
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
  $(".playButton").click(function(event){
    event.preventDefault();
    $("#playerHand").text("");
    $("#dealerHand").text("");
    handInPLay = false;
    gameInitialized = true;
    currentShoe = new Shoe(1);
    playerHand =  new IndividualHand();
    dealerHand = new IndividualHand();
    // unhide necessary fields.
    playerBankRoll = 1000;
    $("#actionOutput").text("The shoe is shuffled and a new game is ready.");
  });
  //scripts for when the player clicks the 'Shuffle' button. Note, this is only an option when the player is not in the middle of a hand.
  $(".shuffleButton").click(function(event){
    event.preventDefault();
    if(gameInitialized) {
      if(!handInPLay){
        currentShoe.shuffle();
        $("#playerHand").text("");
        $("#dealerHand").text("");
        $("#actionOutput").text("The shoe is shuffled.");
        //TO DO: output feedback to let user know the shoe is shuffled
      } else {
        alert("There is currently a hand in play. You can't shuffle the deck until this hand is over.");
      }
    } else {
      alert("You can't do that until you start the game. click the Play! button to start.");
    }
  });
});
