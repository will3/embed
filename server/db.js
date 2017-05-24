const pg = require('pg');

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config =  (process.env.NODE_ENV === 'development' || process.env.NODE_ENV == null) ? {
  user: 'will3', //env var: PGUSER
  database: 'embed', //env var: PGDATABASE
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
} : process.env.DATABASE_URL;

config = 'postgres://mpkytobvuowbgl:ed411a0f16e5753fc018d70aadfe5a94add8728fda687593cf65a883cd9d40a6@ec2-23-23-234-118.compute-1.amazonaws.com:5432/ddkli9qmv5nt7q';

//this initializes a connection pool
//it will keep idle connections open for 30 seconds
//and set a limit of maximum 10 idle clients
const pool = new pg.Pool(config);

pool.on('error', function(err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack);
});

//export the query method for passing queries to the pool
module.exports.query = function(text, values, callback) {
  console.log('query:', text, values);
  return pool.query(text, values, callback);
};

// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = function(callback) {
  return pool.connect(callback);
};
