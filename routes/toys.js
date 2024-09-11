const express = require('express')
const toysController = require('../controllers/itemsController')

const toysRouter = express.Router()

toysRouter.get('/', toysController.get)
toysRouter.get('/view-item/:id', toysController.viewAnItem)
toysRouter.delete('/view-item/:id/delete', toysController.deleteAnItem)
toysRouter.get('/view-item/:id/edit', toysController.editAnItem)
toysRouter.post('/view-item/:id/edit', toysController.enterEditedItem)

module.exports = {toysRouter}