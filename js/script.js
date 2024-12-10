// Define the deck of cards
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

// Initialize game state
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;
let canDouble = false;  // Track if the player can double
let dealerSecondCardRevealed = false; // Track if the dealer's second card should be revealed

// Function to shuffle the deck
function shuffleDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to deal a card to a player
function dealCard(hand) {
    return hand.push(deck.pop());
}

// Function to calculate score
function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    for (let card of hand) {
        score += cardValues[card.value];
        if (card.value === 'A') aces++;
    }

    while (score > 21 && aces) {
        score -= 10;
        aces--;
    }

    return score;
}

// Function to get the image URL for a card
function getCardImage(card) {
    const cardValue = card.value === '10' ? '10' : card.value.charAt(0); // Handling '10' as a special case
    const cardSuit = card.suit;
    return `img/${cardValue}_of_${cardSuit}.png`;
}

// Function to get the back of the card image
function getCardBackImage() {
    return `img/card_back.png`; // Add the back image file name
}

// Function to display cards on the webpage
function displayCards() {
    const playerCardsDiv = document.getElementById('player-cards');
    const dealerCardsDiv = document.getElementById('dealer-cards');
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';

    // Display player cards
    for (let card of playerHand) {
        const img = document.createElement('img');
        img.classList.add('card');
        img.src = getCardImage(card);
        playerCardsDiv.appendChild(img);
    }

    // Display dealer cards
    for (let i = 0; i < dealerHand.length; i++) {
        const img = document.createElement('img');
        img.classList.add('card');

        // Show only the first card and hide the second card if the game is still in progress
        if (i === 1 && !gameOver) {
            img.src = getCardBackImage(); // Back of the card
        } else {
            img.src = getCardImage(dealerHand[i]); // Front of the card
        }

        dealerCardsDiv.appendChild(img);
    }

    // Show the player's score
    document.getElementById('player-score').textContent = `Score: ${playerScore}`;

    // Show dealer's score only if the game is over
    if (gameOver) {
        document.getElementById('dealer-score').textContent = `Score: ${dealerScore}`;
    } else {
        document.getElementById('dealer-score').textContent = `Score: ?`;
    }
}




// Function to update the message
function setMessage(message) {
    document.getElementById('message').textContent = message;
}

// Function to start a new game
function startGame() {
    playerHand = [];
    dealerHand = [];
    deck = [];
    gameOver = false;
    canDouble = false;  // Reset the double flag
    dealerSecondCardRevealed = false; // Hide the dealer's second card initially
    shuffleDeck();

    // Deal initial two cards each
    dealCard(playerHand);
    dealCard(dealerHand);
    dealCard(playerHand);
    dealCard(dealerHand);

    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    displayCards();

    // Hide the dealer's score initially
    document.getElementById('dealer-score').textContent = `Score: ?`;
    
    // Enable the Double Down button only after the initial deal
    canDouble = playerHand.length === 2;
    document.getElementById('double-btn').disabled = !canDouble;

    // Enable/Disable action buttons
    document.getElementById('hit-btn').disabled = false;
    document.getElementById('stand-btn').disabled = false;
    document.getElementById('double-btn').disabled = false;
    document.getElementById('start-btn').disabled = true;

    setMessage('');
}


// Function to handle the "hit" action
function hit() {
    if (gameOver) return;

    dealCard(playerHand);
    playerScore = calculateScore(playerHand);
    displayCards();

    if (playerScore > 21) {
        setMessage('You bust! Dealer wins.');
        gameOver = true;
        endGame();
    }
}

// Function to handle the "stand" action
function stand() {
    if (gameOver) return;

    // Reveal the back card once the player stands
    setTimeout(() => {
        // Now reveal the second dealer card
        document.getElementById('dealer-cards').children[1].src = getCardImage(dealerHand[1]);

        // Reveal dealer's score after the second card is revealed
        document.getElementById('dealer-score').hidden = false;  // Unhide dealer's score
        dealerScore = calculateScore(dealerHand);
        displayCards();
    },); 

    // Dealer's turn to play
    while (dealerScore < 17) {
        dealCard(dealerHand);
        dealerScore = calculateScore(dealerHand);
        displayCards();
    }

    // Final game result checks
    if (dealerScore > 21) {
        setMessage('Dealer busts! You win!');
    } else if (dealerScore > playerScore) {
        setMessage('Dealer wins!');
    } else if (dealerScore < playerScore) {
        setMessage('You win!');
    } else {
        setMessage('It\'s a tie!');
    }

    gameOver = true;
    endGame();
}



// Function to handle the "double down" action
function doubleDown() {
    if (gameOver || !canDouble) return;

    // Double the bet: essentially, we will add one more card and end the player's turn
    dealCard(playerHand);
    playerScore = calculateScore(playerHand);
    displayCards();

    setMessage(`You doubled down! Your final score is ${playerScore}`);

    // After doubling, the player automatically stands
    stand();
}

// Function to handle the end of the game
function endGame() {
    document.getElementById('hit-btn').disabled = true;
    document.getElementById('stand-btn').disabled = true;
    document.getElementById('double-btn').disabled = true;
    document.getElementById('start-btn').disabled = false; // Enable start button for a new game
}

// Event listeners
document.getElementById('hit-btn').addEventListener('click', hit);
document.getElementById('stand-btn').addEventListener('click', stand);
document.getElementById('double-btn').addEventListener('click', doubleDown);
document.getElementById('start-btn').addEventListener('click', startGame);

// Start the game when the page loads
startGame();
