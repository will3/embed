module.exports = (db) => {
  db.collection('shortUrls').ensureIndex({ key: 1 });
};