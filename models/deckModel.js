const mongoose = require('mongoose')
const {cardSchema} = require('./cardModel');


const deckSchema = new mongoose.Schema({
    name: {
        type: String, required: [true, 'Please add a name']
    }, cards: [cardSchema]
}, {
    timestamps: true
})

module.exports = {deckSchema}
