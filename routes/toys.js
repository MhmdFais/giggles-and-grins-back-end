const express = require('express')
const toysController = require('../controllers/itemsController')

const toysRouter = express.Router()

toysRouter.get('/', toysController.get)
toysRouter.get('/add-item', toysController.addAnItem)
toysRouter.get('/view-item/:id', toysController.viewAnItem)
toysRouter.delete('/view-item/:id/delete', toysController.deleteAnItemInCategory)
toysRouter.get('/view-item/:id/edit', toysController.editAnItemInCategory)
toysRouter.post('/view-item/:id/edit', toysController.enterEditedItem)

module.exports = {toysRouter}