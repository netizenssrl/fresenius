// Import database
const knex = require('./../db')

// Retrieve all items
exports.menuItemsAll = async (req, res) => {
  // Get all items from database
  knex
    .select('menu_item.id','menu_item.fk_item','item.title','menu_item.fk_parent','menu_item.norder' ,'item.fk_item_type') // select all records
    .from('menu_item') 
    .innerJoin('item', 'menu_item.fk_item', 'item.id') // from 'menu_item' table
    .orderBy('norder','asc')
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

// Create new item
exports.menuItemsCreate = async (req, res) => {
  // Add new item to database
  knex('menu_item')
    .insert({ // insert new record, a menu_item
      'norder': req.body.norder,
      'fk_parent': req.body.fk_parent,
      'fk_item': req.body.fk_item,
    })
    .then((id) => {
     
      // Send a success message in response
      res.json({ message: `Item \'${req.body.title}\' created.`, id:id })
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error creating ${req.body.title} item: ${err}` })
    })
}

// Remove specific item
exports.menuItemsDelete = async (req, res) => {
 knex
  .select('menu_item.fk_item', 'item.fk_item_type') // select all records
  .from('menu_item') 
  .innerJoin('item', 'menu_item.fk_item', 'item.id') // from 'menu_item' table
  .where('menu_item.id', req.body.id) // find correct record based on id
  .first()
  .then((data) => { 
    // Find specific item in the database and remove it
    knex('menu_item')
      .where('id', req.body.id) // find correct record based on id
      .del() // delete the record
      .then(() => {
        if(data.fk_item_type === 1){
          // Find specific item in the database and remove it
          knex('item')
            .where('id', data.fk_item) // find correct record based on id
            .del() // delete the record
            .then(() => {
              // Send a success message in response
              res.json({ message: `Item ${req.body.id} deleted.` })
            })
            .catch(err => {
              // Send a error message in response
              res.json({ message: `There was an error deleting ${req.body.id} item: ${err}` })
            })
        }else{
          // Send a success message in response
          res.json({ message: `Item ${req.body.id} deleted.` })
        }
      })
      .catch(err => {
        // Send a error message in response
        res.json({ message: `There was an error deleting ${req.body.id} item: ${err}` })
      })
  })
  .catch(err => {
    // Send a error message in response
    res.json({ message: `There was an error deleting ${req.body.id} item: ${err}` })
  })
}


// Update specific item
exports.menuItemsUpdateOrder = async (req, res) => {
   const newFk_parent = req.body.newFk_parent;
   const prevId = req.body.prevId;
   const id = req.body.id;
  // Find specific item in the database
  knex
    .select('*') // select all records
    .from('menu_item') // from 'items' table
    .where('id', id)
    .first()
    .then(itemData=> {
       // tutti quelli correnti più grandi di me vanno a -1
        // console.log( itemData )
        // console.log( `dovremmo esserci almeno qui: id:${id}, fk_parent:${itemData.fk_parent}, order:${itemData.norder}` )
        knex('menu_item')
          .decrement('norder', 1) 
          .where({
            fk_parent: itemData.fk_parent
          }).andWhere('norder', '>', itemData.norder) // find correct record based on id
          .then(() => {

            //prendo l'ordine del tizio che mi precede tramite il suo ID
            knex
              .select('*') // select all records
              .from('menu_item') // from 'items' table
              .where('id', prevId)
              .first()
              .then(prevItemData=> {
                const newNewFk_parent = prevItemData?prevItemData.fk_parent:newFk_parent;
                const newOrder = prevItemData?prevItemData.norder+1:0;
            
                // tutti quelli NUOVI più grandi di me vanno a +1
                knex('menu_item')
                  .increment('norder', 1)  
                  .where({
                    fk_parent: newNewFk_parent
                  }).andWhere('norder', '>=', newOrder) // find correct record based on id
                  .then(() => {
                    // aggiorno il mio PARENT e il mio ORDER
                    knex('menu_item')
                      .where({
                        id: itemData.id
                      })
                      .update({'norder': newOrder,'fk_parent':newNewFk_parent}) // update the record{
                      .then(() => {
                        res.json({ message: `dovremmo esserci` })

                      }).catch(err => {
                        // Send a error message in response
                        res.json({ message: `There was an error updating ${req.body.id} item: ${err}` })
                      })

                  }).catch(err => {
                    // Send a error message in response
                    res.json({ message: `There was an error updating ${req.body.id} item: ${err}` })
                  })

              }).catch(err => {
                // Send a error message in response
                res.json({ message: `There was an error updating ${req.body.id} item: ${err}` })
              })


          }).catch(err => {
            // Send a error message in response
             console.log( `errore!! ${err}` )
            res.json({ message: `There was an error updating ${req.body.id} item: ${err}` })
          })
      
    })
    .catch(err => {
      // Send a error message in response
      res.json({ message: `There was an error updating ${req.body.id} item: ${err}` })
    })
}

// Remove all items on the list
exports.menuItemsReset = async (req, res) => {
  // Remove all items from database
  knex
    .select('*') // select all records
    .from('menu_item') // from 'items' table
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

