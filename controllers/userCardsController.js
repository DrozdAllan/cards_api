const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const {compareCards} = require('../services/cardsComparator');

// @desc    Get the user's cards
// @route   GET /api/users/cards
// @access  Private
const getCards = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user).select('cards');
    if (!user.cards.length) {
        res.json("user has no card");
    } else {
        res.json(user.cards);
    }
})

// @desc    Update user's cards
// @route   PUT /api/users/cards
// @access  Private
// @example {"cards": [{"id": Number, "qty": Number}]}
const updateCards = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user).select('cards');

    const updatedCards = await compareCards(user.cards, req.body.cards);

    // update user's cards and save user
    user.cards = updatedCards;
    const result = await user.save();
    // return user's cards
    res.json(result['cards']);
})

module.exports = {getCards, updateCards}
