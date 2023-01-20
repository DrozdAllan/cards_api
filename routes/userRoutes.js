const express = require("express");
const router = express.Router();
const {protect} = require('../middleware/authMiddleware')
const {registerUser, loginUser, getMe} = require('../controllers/userController')
const {getCards, updateCards} = require('../controllers/userCardsController')
const {getDecks, createDeck, updateDeck} = require('../controllers/userDecksController')

// From /api/users
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.route('/cards')
    .get(protect, getCards)
    .put(protect, updateCards);

router.route('/decks')
    .get(protect, getDecks)
    .post(protect, createDeck)
    .put(protect, updateDeck);

module.exports = router;
