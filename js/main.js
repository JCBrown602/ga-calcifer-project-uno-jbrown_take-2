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

// Win/Lose Message
let message = "";

// Players: Player
let player = 
    {
        "name": "Player",
        "score": 0, // By hand rank
        "money": 0,
        "hand": [],  // What cards is this player holding
        "choice": ""
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
const messageH2 = document.getElementById("message");
const playerCardSection = document.getElementById("player");
const playerH2 = document.getElementById("playerH2");
const dealerCardSection = document.getElementById("dealer");
const dealerH2 = document.getElementById("dealerH2");

const userActions = document.getElementById("userActions");
const buttons = document.querySelectorAll('button');

const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const newDealBtn = document.getElementById("newDeal");
const quitBtn = document.getElementById("quit");

////////////// (VIEW) All DOM action takes place here
function render(message) {
    console.log("Render...");
    console.log(message);
    messageH2.innerHTML = message;
        
    // Clean slate 
    while (playerCardSection.hasChildNodes()) {
        playerCardSection.removeChild(playerCardSection.firstChild);
      }
    while (dealerCardSection.hasChildNodes()) {
        dealerCardSection.removeChild(dealerCardSection.firstChild);
    }

    player.hand.forEach((card) => {
        const node = document.createElement("div");
        const textnode = document.createTextNode(card.faceName);
        node.appendChild(textnode);
        node.classList.add("card");
        playerCardSection.appendChild(node);
    });
    playerH2.innerHTML = `PLAYER SCORE: ${player.score}`;

    dealer.hand.forEach((card) => {
        const node = document.createElement("div");
        const textnode = document.createTextNode(card.faceName);
        node.appendChild(textnode);
        node.classList.add("card");
        dealerCardSection.appendChild(node);
    });
    dealerH2.innerHTML = `DEALER SCORE: ${dealer.score}`;

    // document.getElementById("playerCard1").innerHTML = player.hand[0].faceName;
    // document.getElementById("dealerCard1").innerHTML = dealer.hand[0].faceName;
}; 
/*----- event listeners -----*/
//userActions.addEventListener("click", getPlayerInput(userActions.id));
//buttons.addEventListener("click", getPlayerInput());
hitBtn.addEventListener("click", getPlayerInput(hitBtn.id));
standBtn.addEventListener("click", getPlayerInput("stand"));
newDealBtn.addEventListener("click", getPlayerInput("newDeal"));
quitBtn.addEventListener("click", getPlayerInput("quit"));

// TEMPORARY CONSOLE DRIVER
// function cd_getInput() {
//     const input = prompt(`> Current Score: ${player.score} - (h)it or (s)tand: `);
//     console.log("get input");
//     return input;
// }

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
    render();
}

// Player 'hits' or 'stands'. Dealer deals cards until player gets 21, stand, or bust.
// Then deal next player - in this case the dealer themselves.
function playerLoop() {
    console.log("calling getPlayerInput() in playerLoop()")
    while(player.choice !== "quit") {
        getPlayerInput();
    }
}

// Hit, Stand, or Bust
// Calls whatever mechanism (console, html, etc) is used to get player input and then uses 
// that input to determine next action
function getPlayerInput(input) {
    console.log("Getting player input...");
    console.log(`Input: ${input}`);
    if (input === "hit") {
        console.log("HIT!");
        dealCards(player);
        checkHand(player);
    } else if(input === "stand") { 
        console.log(`${player.name} stands at ${player.score}`);
        // DEBUG: dealer needs to deal rest of their cards
        checkHand(player);
        return;
    }
    return input;
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
        message = `${player.score}... ${player.name} loses.`;
    } else if (player.score === 21 ) {
        message = `${player.score}! ${player.name} WINS!`;
    } else {
        message = `${player.score}... It's a tie!`;
    }
    render(message);
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

//=========================================================================


init();