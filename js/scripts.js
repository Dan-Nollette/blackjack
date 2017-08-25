//Backend scripts (business logic)
var ranks = [["Deuce", 2], ["Three", 3], ["Four", 4], ["Five", 5], ["Six", 6], ["Seven", 7], ["Eight", 8], ["Nine", 9], ["Ten", 10], ["Jack", 10], ["Queen", 10], ["King", 10], ["Ace", 11]];
var suits = ["Spades", "Hearts", "Clubs", "Diamonds"];

function Card(rank, suit, value, number){
  this.rank = rank;
  this.suit = suit;
  this.value = value;
  this.deckNumber = number;
  this.shuffleScore;
};

function IndividualsHand(){
  this.cards = [];
  this.Score = 0;
  this.aces = 0
  this.isSoft = false;
}

function Shoe(decks){
  this.decks = decks;
  this.remainingCards = [];
  var cardsArray = this.remainingCards;
  for (var i = 0; i < this.decks; i++){
    suits.forEach(function(suit){
      ranks.forEach(function(rank){
        cardsArray.push(new Card(rank[0], suit, rank[1], i+1));
      })
    })
  }
  this.redCard = 26;
  this.dealtCards = [];
}

Shoe.prototype.shuffle = function(){
  this.dealtCards.forEach(function(card){
    this.remainingCards.push(card);
  });
  this.dealtCards = [];
  this.remainingCards.forEach(function(card){
    card.shuffleScore = Math.random();
  });
  this.remainingCards.sort(function(a, b){
    console.log("a is:");
    console.log(a);
    console.log("b is:");
    console.log(b);
    return b.shuffleScore - a.shuffleScore;
  });
}

Shoe.prototype.dealCard = function(){

}

Shoe.prototype.dealHand = function(){

}

//frontend scripts (user interface logic)
$(document).ready(function(){
  $("#hitButton").click(function(event){
      event.preventDefault();
      var size = $("#sizes").val();
      var toppings = [];
      toppings = $(".pieOptions input:checkbox:checked").map(function(){
        return $(this).val();
      }).get();
      $("#output").show();
      $("#output").text(getPriceOutput(size, toppings));
  });
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
  $("#doubleButton").click(function(event){
      event.preventDefault();
      var size = $("#sizes").val();
      var toppings = [];
      toppings = $(".pieOptions input:checkbox:checked").map(function(){
        return $(this).val();
      }).get();
      $("#output").show();
      $("#output").text(getPriceOutput(size, toppings));
  });
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
});
