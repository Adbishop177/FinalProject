// Define the deck of cards
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
};

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;
let dealerSecondCardRevealed = false;

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

function dealCard(hand) {
    return hand.push(deck.pop());
}

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

function getCardImage(card) {
    const cardValue = card.value === '10' ? '10' : card.value.charAt(0);
    const cardSuit = card.suit;
    return `img/${cardValue}_of_${cardSuit}.png`;
}

function getCardBackImage() {
    return `img/card_back.png`;
}

function displayCards() {
    const playerCardsDiv = document.getElementById('player-cards');
    const dealerCardsDiv = document.getElementById('dealer-cards');
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';

    for (let card of playerHand) {
        const img = document.createElement('img');
        img.classList.add('card');
        img.src = getCardImage(card);
        playerCardsDiv.appendChild(img);
    }

    for (let i = 0; i < dealerHand.length; i++) {
        const img = document.createElement('img');
        img.classList.add('card');

        if (i === 1 && !gameOver) {
            img.src = getCardBackImage();
        } else {
            img.src = getCardImage(dealerHand[i]);
        }

        dealerCardsDiv.appendChild(img);
    }

    document.getElementById('player-score').textContent = `Score: ${playerScore}`;

    if (gameOver) {
        document.getElementById('dealer-score').textContent = `Score: ${dealerScore}`;
    } else {
        document.getElementById('dealer-score').textContent = `Score: ?`;
    }
}

function setMessage(message) {
    document.getElementById('message').textContent = message;
}

function startGame() {
    playerHand = [];
    dealerHand = [];
    deck = [];
    gameOver = false;
    dealerSecondCardRevealed = false;
    shuffleDeck();

    dealCard(playerHand);
    dealCard(dealerHand);
    dealCard(playerHand);
    dealCard(dealerHand);

    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    displayCards();

    document.getElementById('dealer-score').textContent = `Score: ?`;

    document.getElementById('hit-btn').disabled = false;
    document.getElementById('stand-btn').disabled = false;
    document.getElementById('start-btn').disabled = true;

    setMessage('');
}

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

function stand() {
    if (gameOver) return;

    setTimeout(() => {
        document.getElementById('dealer-cards').children[1].src = getCardImage(dealerHand[1]);
        document.getElementById('dealer-score').hidden = false;
        dealerScore = calculateScore(dealerHand);
        displayCards();
    }, 100);

    while (dealerScore < 17) {
        dealCard(dealerHand);
        dealerScore = calculateScore(dealerHand);
        displayCards();
    }

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

function endGame() {
    document.getElementById('hit-btn').disabled = true;
    document.getElementById('stand-btn').disabled = true;
    document.getElementById('start-btn').disabled = false;
}

document.getElementById('hit-btn').addEventListener('click', hit);
document.getElementById('stand-btn').addEventListener('click', stand);
document.getElementById('start-btn').addEventListener('click', startGame);

startGame();
