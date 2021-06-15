// Import express
const express = require('express')

// Import items-controller
const itemsRoutes = require('./../controllers/items-controller.js')

// Create router
const router = express.Router()
router.get('/all', itemsRoutes.itemsAll)
router.post('/one', itemsRoutes.itemsOne)
router.post('/create', itemsRoutes.itemsCreate)
router.put('/delete', itemsRoutes.itemsDelete)
router.put('/update', itemsRoutes.itemsUpdate)
router.put('/reset', itemsRoutes.itemsReset)


// Export router
module.exports = router
