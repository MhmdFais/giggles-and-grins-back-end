const express = require('express')
const diapersController = require('../controllers/itemsController')

const diapersRouter = express.Router()

diapersRouter.get('/', diapersController.get)
diapersRouter.post('/add-item', diapersController.addAnItem)
diapersRouter.get('/view-item/:id', diapersController.viewAnItem)
diapersRouter.delete('/view-item/:id/delete', diapersController.deleteAnItemInCategory)
diapersRouter.get('/view-item/:id/edit', diapersController.viewAnItem)
diapersRouter.post('/view-item/:id/edit', diapersController.enterEditedItem)

module.exports = diapersRouter