// Import database
const knex = require('./../db')

const util = require('util')

// Retrieve all items
exports.itemsAll = async (req, res) => {
  // Get all items from database
  knex
    .select('*') // select all records
    .from('item') 
    .orderBy('title')
    .then(itemData => {
      // Send items extracted from database in response

      res.json(itemData)
    })
    .catch(err => {
      console.log(`There was an error retrieving items: ${err}`);
      // Send a error message in response
      res.json({ message: `There was an error retrieving items: ${err}` })
    })
}


// Retrieve one item
exports.itemsOne = async (req, res) => {
  // Object.keys(req).forEach((prop)=> console.log(prop));
  // Get all items from database
  knex
    .select('*') // select all records
    .from('item') 
    .where('id', req.body.id)
    .then(itemData => {
      // Send items extracted from database in response

      res.json(itemData[0])
    })
    .catch(err => {
      console.log(`There was an error retrieving items: ${err}`);
      // Send a error message in response
      res.json({ message: `There was an error retrieving items: ${err}` })
    })
}


// Create new item  
exports.itemsCreate = async (req, res) => {
  // Add new item to database
  knex('item')
    .insert({ // insert new record, a item
      'title': req.body.title,
      'content': req.body.content,
      'fk_item_type': req.body.fk_item_type
    })
    .then((itemId) => {

      knex('menu_item')
        .insert({ // insert new record, a item
          'fk_item': +itemId,
          'fk_parent': null,
          'norder': 0
        }).then(() => {
              // Send a success message in response
          res.json({ message: `Item \'${req.body.title}\' created.` })

        }).catch(err => {
        // Send a error message in response
        res.json({ message: `There was an error creating ${req.body.title} item: ${err}` })
      })

    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error creating ${req.body.title} item: ${err}` })
    })
}

// Remove specific item
exports.itemsDelete = async (req, res) => {
  // Find specific item in the database and remove it
  knex('item')
    .where('id', req.body.id) // find correct record based on id
    .del() // delete the record
    .then(() => {
      // Send a success message in response
      res.json({ message: `Item ${req.body.id} deleted.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error deleting ${req.body.id} item: ${err}` })
    })
}


// Update specific item
exports.itemsUpdate = async (req, res) => {
  // Find specific item in the database and update it
  knex('item')
    .where('id', req.body.id) // find correct record based on id
    .update({
      'title': req.body.title,
      'content': req.body.content,
    }) // update the record
    .then(() => {
      // Send a success message in response
      res.json({ message: `Item ${req.body.title} updated.` })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error updating ${req.body.id} item: ${err}` })
    })
}

// Remove all items on the list
exports.itemsReset = async (req, res) => {
  // Remove all items from database
  knex
    .select('*') // select all records
    .from('item') // from 'items' table
    .truncate() // remove the selection
    .then(() => {
      // Send a success message in response
      res.json({ message: 'Item list cleared.' })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error resetting item list: ${err}.` })
    })
}

