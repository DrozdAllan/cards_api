const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const {cardModel} = require('../models/cardModel');
const {compareCards} = require('../services/cardsComparator');

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
const updateDeck = asyncHandler(async (req, res) => {
    // get the mongoose representation of the user
    const user = await User.findById(req.user).select("decks");

    // check if user has a deck with the requested id
    const deck = user.decks.id(req.body.deckId);

    if (!deck) {
        throw new Error("user has no deck with this id");
    }

    const updatedCards = await compareCards(deck.cards, req.body.cards);

    user.decks.id(req.body.deckId).cards = updatedCards;

    const result = await user.save();

    // return user
    res.json(result);
})

module.exports = {
    getDecks, createDeck, updateDeck
}
