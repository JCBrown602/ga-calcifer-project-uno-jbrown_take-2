////////////// (MODEL) Data / State
/*----- constants -----*/
// Pieces for building deck: 52 cards, 4 suits, 14 face names, 14 face values]
// 14 because Ace is special. Starts at 0 but we'll move it up to the top.
// It starts at 0 just because of indexing. Doing it this way makes the 'face values'
// line up with their actual integer values with less hassle.
const suits = ['Clubs','Diamonds','Hearts','Spades'];
const faceNames =
    ['Ace','2','3','4','5','6','7','8','9','10','Jack','Queen','King'];
const faceValues = [];
const faceCards = [];

const finalCheck = [];      // Add the Community Pile to each player hand and store in array

/*----- app's state (variables) -----*/
// Build the deck
let deck = [];
// Assigning integer values to make scoring hands easier
for(let i = 0; i < 14; i++) {
    faceValues[i] = i;
}
// Assign a 'face value' and a suit to a new card object
faceNames.forEach((faceName, idx) => {
    suits.forEach((suit) => {
        let newCard = {};
        newCard.faceName = faceName;
        newCard.faceValue = idx + 1;
        newCard.suit = suit;
        deck.push(newCard);
    });
});
// Make all the face cards have a value of 10
deck.forEach((card) => {
    if (card.faceValue > 10) {
        card.faceValue = 10; 
    }
});

// Players: Player
let player = 
    {
        "name": "Player",
        "score": 0, // By hand rank
        "money": 0,
        "hand": []  // What cards is this player holding
    }

// Players: Player
let dealer = 
    {
        "name": "GA Casino Dealer",
        "score": 0, // By hand rank
        "money": 0,
        "hand": []  // What cards is this player holding
    }

/*----- cached element references -----*/

////////////// (VIEW) All DOM action takes place here
function render() {
    console.log("Render...");
}; 
/*----- event listeners -----*/
// TEMPORARY CONSOLE DRIVER
function cd_getInput() {
    const input = prompt(`>${player.score} - (h)it or (s)tand: `);
    console.log("get input");
    return input;
}

////////////// (CONTROLLER)
/*----- functions -----*/
function init() {
    console.log("Init...");

    // Make sure players have zero cards
    player.hand = [];

    // Shuffle cards
    for(let i = 0; i < 3; i++) { shuffle(deck) }; 
    
    firstDeal();
    playerLoop();

};

/////////// DEALER: https://bicyclecards.com/how-to-play/blackjack/
// Deal a card to the player, then one to the dealer - face up
// Deal a card to the player, one to the dealer - face up, face down, respectively
function firstDeal() {
    for(let i = 0; i < 2; i++) { dealCards(player); dealCards(dealer); }
    
    // If a player is dealt a 'natural', they win and are paid 1.5x their bet

    // Dealer's faceup card must be 10 or Ace for the dealer to look at face down card
    // to see if it's a natural
    // If dealer has a natural, they collect all bets of players who do not have naturals
    // If dealer and player tie, both have naturals, it's a standoff and player gets their bet
    // back.
}

// Player 'hits' or 'stands'. Dealer deals cards until player gets 21, stand, or bust.
// Then deal next player - in this case the dealer themselves.
function playerLoop() {
    console.log("calling getPlayerInput() in playerLoop()")
    getPlayerInput();
}

// Hit, Stand, or Bust
// Calls whatever mechanism (console, html, etc) is used to get player input and then uses 
// that input to determine next action
function getPlayerInput() {
    const input = cd_getInput();
    if (input === "h") {
        console.log("HIT!");
        dealCards(player);
        checkHand(player);
    } else if(input === "s") { 
        console.log(`${player.name} stands at ${player.score}`);
        return;
    }
}

// Dealer: face down is turned up. 17 or more, must stand. Less than 17 must hit until
// 17 or more and then must stand.

// If dealer busts, and player stands, the player is paid the amount of their bet.
// If the dealer stands after 17 and before 21, the dealer pays the bet of the player
// having a higher total and takes the bet of a player with a lower total.

// Shuffle deck
function shuffle(){
    console.log("\tShuffling...");
    for(let i = 0; i < 52; i ++) {
        let tempCard = deck[i];
        let randNum = Math.floor(Math.random() * 52);
        deck[i] = deck[randNum];
        deck[randNum] = tempCard;
    }
    return deck;
}
// Deal cards
function dealCards(player) {
    console.log(`Dealing to ${player.name}`);
    let cardToDeal = deck.pop();
    player.hand.push(cardToDeal);
    player.score += cardToDeal.faceValue;
    return player;
}

// Check hand
function checkHand(player) {
    if (player.score > 21 ) {
        console.log(`${player.score}... ${player.name} loses.`);
    } else if (player.score === 21 ) {
        console.log(`${player.score}! ${player.name} WINS!`);
    } else {
        getPlayerInput();
    }
}

// Betting

// Ace 1 or 10
// Find the four aces and change their faceValue from 1 to 10
function aceToggle() {
    let ace;
    for (let i = 0; i < 4; i++) {
        ace = deck.shift();
        ace.faceValue = 14;
        deck.push(ace);
    }
}

//======================= Win Condition =========================
// Win Condition / Scorekeeper
function checkHands() {
    console.log("zzzzzzzzzzzzzzzzzz");
}
//=========================================================================


init();