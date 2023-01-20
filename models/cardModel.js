const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    _id: {
        type: Number, required: true
    }, name: {
        type: String, required: true
    }, type: {
        type: String, required: true
    }, desc: {
        type: String, required: true
    }, atk: {
        type: Number, required: false
    }, def: {
        type: Number, required: false
    }, level: {
        type: Number, required: false,
    }, race: {
        type: String, required: false
    }, attribute: {
        type: String, required: false
    }, name_en: {
        type: String, required: true
    }, archetype: {
        type: String, required: false
    }, linkval: {
        type: Number, required: false,
    }, linkmarkers: {
        type: [String], default: undefined, required: false,
    }, card_sets: [{
        set_name: String, set_code: String, set_rarity: String, set_rarity_code: String,
        set_price: String,
    }], card_images: [{
        id: Number, image_url: String, image_url_small: String,
    }], card_prices: [{
        cardmarket_price: String, tcgplayer_price: String, ebay_price: String, amazon_price: String,
        coolstruffinc_price: String,
    }], quantity: {
        type: Number, required: false,
    }
},
    {
        // TODO: Test query helper to find by name or name_en  https://mongoosejs.com/docs/guide.html#query-helpers
        query: {
            byName(name) {
                return this.where({ name: new RegExp(name, 'i') })
            }
        }
    });

const cardModel = mongoose.model('Card', cardSchema);

module.exports = {
    cardModel, cardSchema
};
