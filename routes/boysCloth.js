const express = require('express')
const boysClothesController = require('../controllers/itemsController')

const boysRouter = express.Router()

boysRouter.get('/', boysClothesController.get)
boysRouter.get('/view-item/:id', boysClothesController.viewAnItem)
boysRouter.delete('/view-item/:id/delete', boysClothesController.deleteAnItem)
boysRouter.get('/view-item/:id/edit', boysClothesController.editAnItem)
boysRouter.post('/view-item/:id/edit', boysClothesController.enterEditedItem)

module.exports = {boysRouter}