//52 cards = 26 cards each
//Each player's deck

var player1CardLeft = 26;
var player2CardLeft = 26;

var player1Deck = [];
var player2Deck = [];

//Each round, player1Card and player2Card are given random set of cards
//Player1WarCards/player2WarCard is a string, which contains 1, 2, then 3 cards seperated by a +
var player1Card, player2Card, Player1WarCards, Player2WarCards;
var playerTotal = 40;
var id;


var warStarted = false;
//Checks how many cards has been giving when a war has been started
var warCards = 0;

//Whether a war has been started or not


//Keeps track of how many times each player has won in a started war
var player1WarsWon = 0;
var player2WarsWon = 0;
var warInterval;

//Sets a language
var language = "english";

//Created a Card class with 3 parameters: Value, Name, Suit
function Card(value, name, suit) {
    this.value = value;
    this.name = name;
    this.suit = suit;
}

//Deck class
function CardDeck() {
    switch (language) {

        case "english":
            this.names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
            this.suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];

            break;
    }
    var cards = [];

    for (var s = 0; s < this.suits.length; s++) {
        for (var n = 0; n < this.names.length; n++) {
            cards.push(new Card(n + 1, this.names[n], this.suits[s]));
        }
    }
    return cards;
}

//Created an instance for CardDeck
var newDeck = new CardDeck();

//Shuffle the cards so it does not repeat
function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

//Shuffles the deck
newDeck = shuffle(newDeck);

//Gives cards to each player (player1 and player2)
function giveCards(o) {
    var count = o.length / 2;
    for (i = 0; i < count; i++) {
        player1Deck.push(o.shift(0));
        player2Deck.push(o.shift(0));
    }
    player1CardLeft = 26;
    player2CardLeft = 26;
}

giveCards(newDeck);

//Created a DealerCard class
function Player1Card() {}

//Overrides toString() on the dealer card class, which means "new DealerCard().toString()" will return the suit and name
Player1Card.prototype.toString = function() {
    return player1Card[0].suit + " " + player1Card[0].name;
}

//Created a PlayerCard class
function Player2Card() {}

//Overrides toString() on the player card class, which means "new PlayerCard().toString()" will return the suit and name
Player2Card.prototype.toString = function() {
    return player2Card[0].suit + " " + player2Card[0].name;
}

//Give each player a random card from their deck
function selectCards() {
    player1Card = player1Deck.splice(Math.floor(Math.random() * player1Deck.length), 1);
    player2Card = player2Deck.splice(Math.floor(Math.random() * player2Deck.length), 1);


    //The ace is considered to be the highest card. King is considererd the second highest with its value as 13. So I set
    //Ace's value to 14
    if (player1Card[0].value == 1) {
        player1Card[0].value = 14;
    }
    if (player2Card[0].value == 1) {
        player2Card[0].value = 14;
    }
}

//Sets a war. The war interval is 10000ms where each player draws card and the one with the highest
//wins all the set.
function setWar() {
    warStarted = true;
    $("#player1").text("");
    $("#player2").text("");
    $("#id").text("");
    startWar();
    warInterval = setInterval(startWar, 1000);

}

//Starts a war. It will run while the war is ongoing.
function startWar() {
    if (warCards < 3) {
        selectCards();
        if (warCards == 0) {
            Player1WarCards = new Player1Card().toString();
            Player2WarCards = new Player2Card().toString();
            $("#player1").append(Player1WarCards);
            $("#player2").append(Player2WarCards);

        } else {
            Player1WarCards += " + " + new Player1Card().toString();
            Player2WarCards += " + " + new Player2Card().toString();
            $("#player1").text(Player1WarCards);
            $("#player2").text(Player2WarCards);
        }
        notifyWinner();
        warCards++;
        player1CardLeft--;
        player2CardLeft--;
        console.log("War cards: " + warCards);
    } else if (warCards == 3) {
        warWinner();
        warCards = 0;
        warStarted = false;
    }
}
//Two players will draw cards and an interval is set to. The player with the highest cards wins
function warWinner() {
    if (player2WarsWon >= 2 && warCards == 3) {
        console.log("PLAYER 1 WON!!!");
            playerHistory("Player 1", Player1WarCards, Player2WarCards);
            $("#winner").text("PLAYER 1 won!").addClass("winnerFound");
           // setPlayerTotal(betAmount, false);

    } else if (player1WarsWon >= 2 && warCards == 3) {
       // setPlayerTotal(betAmount, true);
        playerHistory("Player 2", Player1WarCards, Player2WarCards);
        $("#winner").text("PLAYER 2 won!").addClass("winnerFound");
        console.log("PLAYER 2  WON!!!");
    }
    clearInterval(warInterval);
    warStarted = false;
}

//Checks who wins each card draw. Pretty self-explanatory
function notifyWinner() {
    if (warStarted) {
        if (player1Card[0].value < player2Card[0].value) {
            $("#winner").text("PLAYER 1 wins!");
            player2WarsWon++;

            //display total number of wars player 1 won
        } else if (player1Card[0].value > player2Card[0].value) {
            $("#winner").text("PLAYER 2 wins!");
            player1WarsWon++;
            //display total number of wars player 2 won

        } else if (player1Card[0].value == player2Card[0].value) {
            $("#winner").text("ITS WAR TIME");
            $("#war").show();
            $("#draw").hide();
        }
    } else {
        Player1WarCards = new Player1Card().toString();
        Player2WarCards = new Player2Card().toString();
        if (player1Card[0].value < player2Card[0].value) {
            $("#winner").text("Player 2 wins!");
            playerHistory( "Player 2", Player1WarCards, Player2WarCards);
        } else if (player1Card[0].value > player2Card[0].value) {
            $("#winner").text("Player 1 wins!");
            playerHistory( "Player 1", Player1WarCards, Player2WarCards);

        } else if (player1Card[0].value == player2Card[0].value) {
            warCards++;
            $("#winner").text("ITS WAR TIME");
            $("#war").show();
            $("#draw").hide();
        }
    }
}

//When the deal button has been pressed, start dealing the cards
$("#draw").on("click", function() {
    $("#players").text('War Cards ' +warCards);
    console.log("War cards: " + warCards);
    $("#player1CardLeft").text('Player 1 Cards Left  ' +player1CardLeft);
    $("#player2CardLeft").text('Player 2 Cards Left  '+player2CardLeft);


    //console.log("Amount of player cards: " + playerAmountLeft);
    if(warCards == 1){
        $("#players").text('War Cards' +warCards++);

    }
 if (playerTotal > 0) {
        selectCards();
        player1CardLeft--;
        player2CardLeft--;

        $("#player1").text(new Player1Card().toString());
        $("#player2").text(new Player2Card().toString());

        notifyWinner();

        if (player1CardLeft == 0) {

            console.log("GAME DONE! STARTING NEW");
            myDeck = new CardDeck();
            myDeck = shuffle(myDeck);
            giveCards(myDeck);
        }
    } else {
alert("Error...please Refresh")

    }
});


//Checks which button has been pressed (forfeit, continue or double)
//Used to set the bet amount
$("#war button").on("click", function() {
   if ($(this).attr("data-id") == "continue") {
        setWar();
    }
    $("#draw").show();
    $("#war").hide();
});



function updatePlayerTotal() {     $("#totalAmount").text("Total: " + playerTotal); }

//Function createHistory displays the history of games won by each player.
function playerHistory( winner, player1, player2) {
    $("#historyHeader").after('<div class="historyGame"> - Winner: <span class="historyWinner">' + winner + '</span> </span><br /><span class="historyDealer"><b>Player 1:</b> <span class="historyDealerInner">' + player1 + '</span></span><br /><span class="historyPlayer"><b>Player 2:</b> <span class="historyPlayerInner">' + player2 + '</span></span></div>');
    if (winner == "Player 2") {
        $(".historyGame:first .historyPlayerInner").addClass("historyWinner");
    } else {
        $(".historyGame:first .historyDealerInner").addClass("historyWinner");
    }
    if ($(".historyGame").length > 1) {
        $(".historyGame:first").append("<hr>");
    }
}





