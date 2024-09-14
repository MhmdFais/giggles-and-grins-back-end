const express = require('express')
const babyGearController = require('../controllers/itemsController')

const babyGearsRouter = express.Router()

babyGearsRouter.get('/', babyGearController.get)
babyGearsRouter.get('/add-item', babyGearController.addAnItem)
babyGearsRouter.get('/view-item/:id', babyGearController.viewAnItem)
babyGearsRouter.delete('/view-item/:id/delete', babyGearController.deleteAnItemInCategory)
babyGearsRouter.get('/view-item/:id/edit', babyGearController.editAnItemInCategory)
babyGearsRouter.post('/view-item/:id/edit', babyGearController.enterEditedItem)

module.exports = {babyGearsRouter}