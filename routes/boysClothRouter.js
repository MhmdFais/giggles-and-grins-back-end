const express = require('express')
const boysClothesController = require('../controllers/itemsController')

const boysRouter = express.Router()

boysRouter.get('/', boysClothesController.get)
boysRouter.post('/add-item', boysClothesController.addAnItem)
boysRouter.get('/view-item/:id', boysClothesController.viewAnItem) 
boysRouter.delete('/view-item/:id', boysClothesController.deleteAnItemInCategory)
boysRouter.get('/view-item/:id/edit', boysClothesController.viewAnItem)
boysRouter.post('/view-item/:id/edit', boysClothesController.enterEditedItem)

module.exports = boysRouter