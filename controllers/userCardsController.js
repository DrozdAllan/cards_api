const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const {cardModel} = require('../models/cardModel');

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
    let updatedCards = [];

    // NOTES: si la qty est négative ça déduit
    // ATTENTION : si y a 2x le même id dans la requête ça inscrit 2x la même carte dans la DB
    const newCards = req.body.cards;

    // retrieve user's cards
    const oldCards = user.cards;

    // if user had no cards, add everything
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

    // update user's cards and save user
    user.cards = updatedCards;
    const result = await user.save();
    // return user's cards
    res.json(result['cards']);
})

module.exports = {getCards, updateCards}
