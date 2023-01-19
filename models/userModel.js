const mongoose = require('mongoose')
const {cardSchema} = require('./cardModel');
const {deckSchema} = require('./deckModel');


const userSchema = new mongoose.Schema({
    name: {
        type: String, required: [true, 'Please add a name']
    }, email: {
        type: String, required: [true, 'Please add an email']
    }, password: {
        type: String, required: [true, 'Please add a password']
    }, cards: [cardSchema], decks: [deckSchema],
}, {
    timestamps: false
})

module.exports = mongoose.model('User', userSchema)
