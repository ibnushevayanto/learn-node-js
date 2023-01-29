const mysql = require("mysql2");

/**
 * createPool will allow us to always reach out to it wherever we have a query to run and then we get a new connection from that pool which manages multiple connections.
 * So that we can run multiple queries simultaneously because each query need its own connection and once the query is done
 * the connection will be handed back into the pool and its available again for new query and the pool can then be finished when our application shuts down
 */

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "learn-nodejs",
});

module.exports = pool.promise(); // * allow to use promise instead callback function
