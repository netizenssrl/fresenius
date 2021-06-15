// Import express
const express = require('express')

// Import items-controller
const menuItemsRoutes = require('./../controllers/menu-items-controller.js')

// Create router
const router = express.Router()

// Add route for GET request to retrieve all item
// In server.js, items route is specified as '/items'
// this means that '/all' translates to '/items/all'
router.get('/all', menuItemsRoutes.menuItemsAll)

// Add route for POST request to create new item
// In server.js, items route is specified as '/items'
// this means that '/create' translates to '/items/create'
router.post('/create', menuItemsRoutes.menuItemsCreate)

// Add route for PUT request to delete specific item
// In server.js, items route is specified as '/items'
// this means that '/delete' translates to '/items/delete'
router.put('/delete', menuItemsRoutes.menuItemsDelete)

// Add route for UPDATE request to delete specific item
// In server.js, items route is specified as '/items'
// this means that '/update' translates to '/items/update'
router.put('/updateOrder', menuItemsRoutes.menuItemsUpdateOrder)

// Add route for PUT request to reset itemshelf list
// In server.js, items route is specified as '/items'
// this means that '/reset' translates to '/items/reset'
router.put('/reset', menuItemsRoutes.menuItemsReset)

// Export router
module.exports = router
