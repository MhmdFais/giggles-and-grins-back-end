const express = require('express')
const toysController = require('../controllers/itemsController')

const toysRouter = express.Router()

toysRouter.get('/', toysController.get)
toysRouter.post('/add-item', toysController.addAnItem)
toysRouter.get('/view-item/:id', toysController.viewAnItem)
toysRouter.delete('/view-item/:id', toysController.deleteAnItemInCategory)
toysRouter.get('/view-item/:id/edit', toysController.viewAnItem)
toysRouter.post('/view-item/:id/edit', toysController.enterEditedItem)

module.exports = toysRouter