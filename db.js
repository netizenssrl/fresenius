// Import path module
const path = require('path')

// Get the location of database.sqlite file
// const dbPath = path.resolve(__dirname, 'db/database.sqlite')
const dbPath = path.resolve(__dirname, 'db/fresenius.db')
//const dbPath = path.resolve('https://fresenius.netizens.it/db/fresenius.db');
// Create connection to SQLite database
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true
})

// Create a table in the database called "menu_item"
knex.schema
  // Make sure no "menu_item" table exists
  // before trying to create new
  .hasTable('menu_item')
    .then((exists) => {
      if (!exists) {
          console.error(`DB menu_item is missing`)
      }
    })
    .then(() => {
      // Log success message
      console.log('done')
    })
    .catch((error) => {
      console.error(`There was an error setting up the database: ${error}`)
    })

// Just for debugging purposes:
// Log all data in "menu_item" table
// knex.select('*').from('menu_item')
//   .then(data => console.log('data:', data))
//   .catch(err => console.log(err))

// Export the database
module.exports = knex