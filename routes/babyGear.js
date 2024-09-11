const express = require('express')
const babyGearController = require('../controllers/itemsController')

const babyGearsRouter = express.Router()

babyGearsRouter.get('/', babyGearController.get)
babyGearsRouter.get('/view-item/:id', babyGearController.viewAnItem)
babyGearsRouter.delete('/view-item/:id/delete', babyGearController.deleteAnItem)
babyGearsRouter.get('/view-item/:id/edit', babyGearController.editAnItem)
babyGearsRouter.post('/view-item/:id/edit', babyGearController.enterEditedItem)

module.exports = {babyGearsRouter}