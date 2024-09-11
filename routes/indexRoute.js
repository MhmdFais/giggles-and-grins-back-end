const indexController = require('../controllers/indexController')
const express = require('express')

const indexRoute = express.Router()

indexRoute.get('/', indexController.get)

module.exports = {
    indexController
}