const express = require('express')
const girlsClothController = require('../controllers/itemsController')

const girlsClothRoute = express.Router()

girlsClothRoute.get('/', girlsClothController.get)
girlsClothRoute.get('/add-item', girlsClothController.addAnItem)
girlsClothRoute.get('/view-item/:id', girlsClothController.viewAnItem)
girlsClothRoute.delete('/view-item/:id/delete', girlsClothController.deleteAnItemInCategory)
girlsClothRoute.get('/view-item/:id/edit', girlsClothController.editAnItemInCategory)
girlsClothRoute.post('/view-item/:id/edit', girlsClothController.enterEditedItem)

module.exports = girlsClothRoute