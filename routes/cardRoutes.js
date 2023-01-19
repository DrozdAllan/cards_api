const express = require("express");
const {getCards, searchCards, advancedSearch} = require("../controllers/cardController");
const router = express.Router();

// From /api/cards
router.route('/').get(getCards).post(searchCards);
router.route('/advanced').post(advancedSearch);

module.exports = router;
