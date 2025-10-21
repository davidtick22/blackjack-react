import React, {useState, useEffect} from 'react';

enum Suit {
    Hearts = "Hearts",
    Diamonds = "Diamonds",
    Clubs = "Clubs",
    Spades = "Spades",
}

enum Rank{
    Two = "2",
    Three = "3",
    Four = "4",
    Five = "5",
    Six = "6",
    Seven = "7",
    Eight = "8",
    Nine = "9",
    Ten = "10",
    Jack = "J",
    Queen = "Q",
    King = "K",
    Ace = "A",
}

interface Card {
    rank: Rank;
    suit: Suit;
}

// Card Values
const cardVal: [Rank, number][] = [
    [Rank.Two, 2],
    [Rank.Three, 3],
    [Rank.Four, 4],
    [Rank.Five, 5],
    [Rank.Six, 6],
    [Rank.Seven, 7],
    [Rank.Eight, 8],
    [Rank.Nine, 9],
    [Rank.Ten, 10],
    [Rank.Jack, 10],
    [Rank.Queen, 10],
    [Rank.King, 10],
    [Rank.Ace, 11]
];

const cardValMap: Map<Rank, number> = new Map();
for(let [r, v] of cardVal) {
    cardValMap.set(r, v);
}

// deck building and shuffling logic
const buildDeck = (): Card[] => {
    const deck: Card[] = [];
    for (let suit in Suit) {
        for (let rank in Rank) {
            deck.push({
                rank: Rank[rank as keyof typeof Rank],
                suit: Suit[suit as keyof typeof Suit]
            });
        }
    }
    return deck;
}

// Fisher-Yates card shuffle
const shuffleDeck = (deck: Card[]): Card[] => {
    // copy the deck
    const copy: Card[] = [...deck];
    for (let i = copy.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// calculates hand value with Ace logic
const getHandValue = (hand: Card[]): number => {
    let value = 0;
    let aceCount = 0;
    for (let card of hand) {
        const cardVal = cardValMap.get(card.rank)!;
        value += cardVal;

        // check for Aces
        if (card.rank === Rank.Ace) {
            aceCount++;
        }
    }
    // handle Ace logic
    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }
    return value;
}

const getCardImg = (card: Card): string => {
    let rank: string = card.rank;

    if (rank === "J") rank = "jack";
    else if (rank === "Q") rank = "queen";
    else if (rank === "K") rank = "king";
    else if (rank === "A") rank = "ace";

    const suit = card.suit.toLowerCase();

    return `/cards/${rank}_of_${suit}.png`;
};



// Blackjack component
const BlackJack: React.FC = () => {
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [message, setMessage] = useState("");

    // button style
    const buttonStyle = {
        backgroundColor: "#fff",
        color: "#222",
        padding: "10px 16px",
        fontSize: "16px",
        borderRadius: "6px",
        border: "none",
        margin: "0 8px",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
    };

    const dealInitial = () => {
        const freshDeck = shuffleDeck(buildDeck());
        setDeck(freshDeck.slice(4));
        setPlayerHand([freshDeck[0], freshDeck[2]]);
        setDealerHand([freshDeck[1], freshDeck[3]]);
        setMessage("");
        setGameOver(false);
    };

    const hit = () => {
        if (gameOver || deck.length === 0) return;

        const nextCard = deck[0];
        const newDeck = deck.slice(1);
        const newHand = [...playerHand, nextCard];

        setPlayerHand(newHand);
        setDeck(newDeck);

        if (getHandValue(newHand) > 21) {
            setMessage("You busted!");
            setGameOver(true);
        }
    };

    const stand = () => {
        let dHand = [...dealerHand];
        let currentDeck = [...deck];

        // Dealer draws until reaching 17 or higher
        while (getHandValue(dHand) < 17 && currentDeck.length > 0) {
            dHand.push(currentDeck[0]);
            currentDeck = currentDeck.slice(1);
        }

        const playerTotal = getHandValue(playerHand);
        const dealerTotal = getHandValue(dHand);

        setDealerHand(dHand);
        setDeck(currentDeck);
        setGameOver(true);

        if (dealerTotal > 21) {
            setMessage("Dealer busted! You win!");
        } else if (playerTotal > dealerTotal) {
            setMessage("You win!");
        } else if (playerTotal < dealerTotal) {
            setMessage("Dealer wins!");
        } else {
            setMessage("Push! It's a tie.");
        }
    };

    useEffect(() => {
        dealInitial();
    }, []);

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            backgroundColor: "#2e8b57",
            fontFamily: "'Courier New', monospace",
            color: "white"
        }}>
            <div style={{ textAlign: "center", maxWidth: "700px" }}>
                <h1 style={{
                    fontSize: "3rem",
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#f0f0f0",
                    textShadow: `
                        -1px -1px 0 #222,
                        1px -1px 0 #222,
                        -1px 1px 0 #222,
                        1px 1px 0 #222
                      `,
                    letterSpacing: "4px",
                    marginBottom: "1.5rem"
                }}>
                    BlackJack
                </h1>

                <h2 style={{
                    fontSize: "1rem",
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#f0f0f0",
                    textShadow: `
                        -1px -1px 0 #222,
                        1px -1px 0 #222,
                        -1px 1px 0 #222,
                        1px 1px 0 #222
                      `,
                    letterSpacing: "4px",
                    marginBottom: "1.5rem"
                }}>
                    Dealer Hand ({gameOver ? getHandValue(dealerHand) : "?"})
                </h2>
                <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: "2rem"
                }}>
                    {dealerHand.map((card, i) => {
                        const isHidden = i === 1 && !gameOver;
                        const imgSrc = isHidden ? "/cards/back.png" : getCardImg(card);

                        return (
                            <div
                                key={i}
                                style={{
                                    display: "inline-block",
                                    backgroundColor: "white",
                                    borderRadius: "6px",
                                    padding: "4px",
                                    marginRight: "8px",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                                }}
                            >
                                <img
                                    src={imgSrc}
                                    alt={isHidden ? "Hidden card" : `${card.rank} of ${card.suit}`}
                                    style={{
                                        width: "72px",
                                        display: "block",
                                        filter: isHidden ? "brightness(0.7)" : "none"
                                    }}
                                />
                            </div>
                        );
                    })}
                </p>

                <h2 style={{
                    fontSize: "1rem",
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#f0f0f0",
                    textShadow: `
                        -1px -1px 0 #222,
                        1px -1px 0 #222,
                        -1px 1px 0 #222,
                        1px 1px 0 #222
                      `,
                    letterSpacing: "4px",
                    marginBottom: "1.5rem"
                }}>
                    Player Hand ({getHandValue(playerHand)})
                </h2>
                <p style={{ marginBottom: "2rem" }}>
                    {playerHand.map((card, i) => (
                        <div
                            key={i}
                            style={{
                                display: "inline-block",
                                backgroundColor: "white",
                                borderRadius: "6px",
                                padding: "4px",
                                marginRight: "8px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                            }}
                        >
                            <img
                                src={getCardImg(card)}
                                alt={`${card.rank} of ${card.suit}`}
                                style={{
                                    width: "72px",
                                    display: "block"
                                }}
                            />
                        </div>
                    ))}
                </p>

                <div style={{ marginBottom: "1.5rem" }}>
                    <button
                        onClick={hit}
                        disabled={gameOver}
                        style={buttonStyle}
                    >
                        Hit
                    </button>
                    <button
                        onClick={stand}
                        disabled={gameOver}
                        style={buttonStyle}
                    >
                        Stand
                    </button>
                    <button
                        onClick={dealInitial}
                        style={buttonStyle}
                    >
                        New Game
                    </button>
                </div>

                <h3 style={{
                    fontFamily: "'Poppins', sans-serif", // or DM Sans, Inter, etc.
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: "#fff",
                    textShadow: "-1px -1px 0 #222, 1px -1px 0 #222, -1px 1px 0 #222, 1px 1px 0 #222",
                    marginTop: "1rem"
                }}>
                    {message}
                </h3>
            </div>
        </div>
    );
};

export default BlackJack;