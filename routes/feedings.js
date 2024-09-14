const express = require('express')
const feedingsController = require('../controllers/itemsController')

const feedingsRouter = express.Router()

feedingsRouter.get('/', feedingsController.get)
feedingsRouter.get('/add-item', feedingsController.addAnItem)
feedingsRouter.get('/view-item/:id', feedingsController.viewAnItem)
feedingsRouter.delete('/view-item/:id/delete', feedingsController.deleteAnItemInCategory)
feedingsRouter.get('/view-item/:id/edit', feedingsController.editAnItemInCategory)
feedingsRouter.post('/view-item/:id/edit', feedingsController.enterEditedItem)

module.exports = feedingsRouter