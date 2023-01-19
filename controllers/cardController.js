const asyncHandler = require('express-async-handler');
const {cardModel} = require('../models/cardModel');

// @desc    Get 25 random cards
// @route   GET api/cards
// @access  Public
const getCards = asyncHandler(async (req, res) => {
    const cards = await cardModel.aggregate([{$sample: {size: 25}}])
    res.json(cards)
})

// @desc    Search cards by parameter 'cardCode' or 'cardName'
// @route   POST api/cards
// @access  Public
// @example {"cardName": String} or {"cardCode": Number}
const searchCards = asyncHandler(async (req, res) => {

    const cardCode = req.body.cardCode;
    // name as lowercase 'abeille automate'
    // NOTE: il faut mettre les accents et les apostrophes (fix)
    const cardName = req.body.cardName;

    let result = [];

    if (cardCode) {
        result = await cardModel.find({_id: cardCode});
    } else {
        const cardsFr = await cardModel.find({
            // TODO: is it possible to trim ' and accents with the regex option in MongoDB ?
            // see https://www.mongodb.com/docs/manual/reference/operator/query/regex/
            name: {
                $regex: cardName, "$options": "i"
            }
        })
        const cardsEn = await cardModel.find({
            name_en: {
                $regex: cardName, $options: "i"
            }
        })
        result = cardsFr;
        for (const card of cardsEn) {
            result.push(card);
        }
    }
    res.json(result);
})


// @desc    Search cards by 'cardName' AND parameters type (Trap Card, Spell Card, Monster...) and if Monster type, search by Normal Monster or Effect Monster and race & attribute and if type Link or Effect Monster etc...
// @route   POST api/cards/advanced
// @access  Public
// @example TODO: make example
const advancedSearch = asyncHandler(async (req, res) => {
    const criteria = req.body;

    let query;

    // TODO: name with minimum 3 letters ? 4 ?
    if (criteria.type === "Normal Monster") {
        if (criteria.race && !criteria.attribute) {
            // race and no attribute
            query = {
                name: {
                    $regex: criteria.cardName, "$options": "i"
                }, type: "Normal Monster", race: criteria.race
            };
        } else if (!criteria.race && criteria.attribute) {
            // attribute and no race
            query = {
                name: {
                    $regex: criteria.cardName, "$options": "i"
                }, type: "Normal Monster", attribute: criteria.attribute
            };
        } else if (criteria.race && criteria.attribute) {
            // race and attribute
            query = {
                name: {
                    $regex: criteria.cardName, "$options": "i"
                }, type: "Normal Monster", race: criteria.race, attribute: criteria.attribute
            };
        } else {
            // no race and no attribute
            query = {
                name: {
                    $regex: criteria.cardName, "$options": "i"
                }, type: "Normal Monster"
            };
        }
    } else if (criteria.type === "Effect Monster") {
        if (criteria.race && !criteria.attribute) {
            // race and no attribute
            query = {
                name: {
                    $regex: criteria.cardName, "$options": "i"
                }, type: "Effect Monster", race: criteria.race
            };
        } else if (!criteria.race && criteria.attribute) {
            // attribute and no race
            query = {
                name: {
                    $regex: criteria.cardName, "$options": "i"
                }, type: "Effect Monster", attribute: criteria.attribute
            };
        } else if (criteria.race && criteria.attribute) {
            // race and attribute
            query = {
                name: {
                    $regex: criteria.cardName, "$options": "i"
                }, type: "Effect Monster", race: criteria.race, attribute: criteria.attribute
            };
        } else {
            // no race and no attribute
            query = {
                name: {
                    $regex: criteria.cardName, "$options": "i"
                }, type: "Effect Monster"
            };
        }
    } else {
        // TODO Type : Magic, Trap, Synchro Monster...
        // TODO: faire un switch pour créer la query
    }

    console.log(query);
    // throw Error();
    const result = await cardModel.find(query);
    res.json(result);
})

module.exports = {
    getCards, searchCards, advancedSearch
}
