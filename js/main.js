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

// Players: Player, Computer1, Computer2, etc.
let player = 
    {
        "name": "Player",
        "score": 0, // By hand rank
        "money": 0,
        "numSeq": 0, // Number of sequential cards
        "hand": []  // What cards is this player holding
    }

/*----- cached element references -----*/

////////////// (VIEW) All DOM action takes place here
function render() {
    console.log("Render...");
}; 
/*----- event listeners -----*/
// TEMPORARY CONSOLE DRIVER


////////////// (CONTROLLER)
/*----- functions -----*/
function init() {
    console.log("Init...");

    // Make sure players have zero cards
    player.hand = [];
    console.log("The starting deck:");
    console.log(deck.slice(0,5));

    // Shuffle cards
    shuffle(deck);
    console.log("Every day I'm ");
    shuffle(deck);
    shuffle(deck);
    console.log(deck.slice(0,5));

    // Deal cards (first two)
    console.log(`Cards remaining in deck: ${deck.length}`);
    dealCards(player);

    checkHands();

};

// Dealer?

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
    console.log("Dealing...");
    let cardToDeal = deck.pop();
    player.hand.push(cardToDeal);
    player.score += cardToDeal.faceValue;
    console.log(`\tPLAYER: ${player.name}, SCORE: ${player.score}`);
    console.log(player.hand);
    return player;
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