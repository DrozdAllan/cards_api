const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const {cardModel} = require('../models/cardModel');

// @desc    Get the user's decks
// @route   GET /api/users/decks
// @access  Private
const getDecks = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user).select('decks');
    if (!user.decks.length) {
        res.json("user has no deck")
    } else {
        res.json(user.decks);
    }
})

// @desc    Create new deck
// @route   POST /api/users/decks
// @access  Private
// @example {"name": String, "cards": [{"id":  Number, "qty": Number}]}
const createDeck = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);

    const newDeck = req.body;

    let deckCards = [];

    //verify if deck's name already exists
    for (const deck of user.decks) {
        if (newDeck.name === deck.name) {
            res.json("a deck already exists with this name");
            break;
        }
    }

    // search for every card in the new deck
    for (const newCard of newDeck.cards) {
        const requestCard = await cardModel.findOne({
            _id: {$in: newCard['id']}
        });
        requestCard['quantity'] = newCard['qty'];
        deckCards.push(requestCard);
    }

    user.decks.push({
        'name': newDeck.name, 'cards': deckCards,
    });

    const result = await user.save();
    // return user
    res.json(result['decks']);
})

// @desc    Update user's decks
// @route   PUT /api/users/decks
// @access  Private
// @example {"deckId": String, "cards": [{"id": Number, "qty": Number}]}
const updateDecks = asyncHandler(async (req, res) => {
    // get the mongoose representation of the user
    const user = await User.findById(req.user).select("decks");

    // check if user has a deck with the requested id
    const deck = await user.decks.id(req.body.deckId);

    if (!deck) {
        throw new Error("user has no deck with this id");
    }

    let updatedCards = [];

    const newCards = req.body.cards;

    // retrieve deck's cards
    const oldCards = deck.cards;

    // TODO: fix: si y a qu'une carte le truc pète
    // if the deck was empty, add everything
    if (!oldCards.length) {
        for (const newCard of newCards) {
            // verify if input has 0 or less qty when there's no card
            if (newCard['qty'] > 0) {
                // for each newCard id, find the card model and add qty
                const requestCard = await cardModel.findOne({
                    _id: {$in: newCard['id']}
                });
                requestCard['quantity'] = newCard['qty'];
                updatedCards.push(requestCard);
            }
        }
    } else {
        oldCards.forEach((oldCard) => {
            let cardFound = newCards.find(card => card.id === oldCard._id);
            if (cardFound) {
                const newQty = oldCard.quantity + cardFound['qty'];
                const index = newCards.indexOf(cardFound);
                newCards.splice(index, 1);
                if (newQty > 0) {
                    oldCard.quantity = newQty;
                    updatedCards.push(oldCard);
                }
                // TODO: check this function, why it doesn't delete the card when qty = 0 ?
            } else {
                updatedCards.push(card);
            }
        })

        for (const newCard of newCards) {
            if (newCard && newCard.qty > 0) {
                const requestCard = await cardModel.findOne({
                    _id: {$in: newCard['id']}
                });
                requestCard['quantity'] = newCard['qty'];
                updatedCards.push(requestCard);
            }
        }
    }

    // TODO: fix: si card qty <= 0 la carte ne bouge pas dans la DB
    user.decks[req.body.deckId] = updatedCards;

    const result = await user.save();
    // // return user's cards
    res.json(result['decks'][req.body.deckId]);
})

module.exports = {
    getDecks, createDeck, updateDecks
}
