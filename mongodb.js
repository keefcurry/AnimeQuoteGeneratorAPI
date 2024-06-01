const { MongoClient, ServerApiVersion } = require('mongodb');
const credentials = require('./credentials.js');

let client = new MongoClient(credentials.uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

let conn;
try {
// Connect the client to the server	(optional starting in v4.7)
  conn = client.connect();  
} catch(e) {
  console.error(e);
}

let db = client.db("simple_database");

// Send a ping to confirm a successful connection
db.command({ ping: 1 });
console.log("Pinged your deployment. You successfully connected to MongoDB!");
module.exports = { db }