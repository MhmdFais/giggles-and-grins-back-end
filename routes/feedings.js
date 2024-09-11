const require = require('express')
const feedingsController = require('../controllers/itemsController')

const feedingsRouter = express.Router()

feedingsRouter.get('/', feedingsController.get)
feedingsRouter.get('/view-item/:id', feedingsController.viewAnItem)
feedingsRouter.delete('/view-item/:id/delete', feedingsController.deleteAnItem)
feedingsRouter.get('/view-item/:id/edit', feedingsController.editAnItem)
feedingsRouter.post('/view-item/:id/edit', feedingsController.enterEditedItem)

module.exports = {feedingsRouter}