const express = require('express')
const feedingsController = require('../controllers/itemsController')

const feedingsRouter = express.Router()

feedingsRouter.get('/', feedingsController.get)
feedingsRouter.post('/add-item', feedingsController.addAnItem)
feedingsRouter.get('/view-item/:id', feedingsController.viewAnItem)
feedingsRouter.delete('/view-item/:id/delete', feedingsController.deleteAnItemInCategory)
feedingsRouter.get('/view-item/:id/edit', feedingsController.viewAnItem)
feedingsRouter.post('/view-item/:id/edit', feedingsController.enterEditedItem)

module.exports = feedingsRouter