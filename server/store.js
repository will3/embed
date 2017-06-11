const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://will3:190791@ds119772.mlab.com:19772/heroku_pht4czhz';



const connect = () => {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(db);
    });
  });
};

module.exports = {
  connect
};