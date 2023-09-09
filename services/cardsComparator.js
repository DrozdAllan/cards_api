const { cardModel } = require('../models/cardModel');

// NOTES: si la qty est négative ça déduit
// ATTENTION : si y a 2x le même id dans la requête ça inscrit 2x la même carte dans la DB
// get [{cards}] and [{cards}], return [{"_id": string, "qty": number}]
async function compareCards(oldCards, newCards) {
    let updatedCards = [];

    // if there was no card, add everything
    if (!oldCards.length) {
        for (const newCard of newCards) {
            // verify if input has 0 or less qty when there's no card
            if (newCard['qty'] > 0) {
                // for each newCard id, find the card model and add qty
                const requestCard = await cardModel.findOne({
                    _id: { $in: newCard['id'] }
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
                updatedCards.push(oldCard);
            }
        })

        for (const newCard of newCards) {
            if (newCard && newCard.qty > 0) {
                const requestCard = await cardModel.findOne({
                    _id: { $in: newCard['id'] }
                });
                requestCard['quantity'] = newCard['qty'];
                updatedCards.push(requestCard);
            }
        }
    }

    return updatedCards;
}

module.exports = { compareCards }