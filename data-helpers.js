"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`.. (knex)
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
   savePoll: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, (err, result) => {
      if (err) {
        return callback(err);
      }
      callback(null, true);
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
       db.collection("tweets").find().toArray((err, tweets) => {
      if (err) {
        return callback(err);
       }
        callback(null, tweets);
      });
    }
  };
}
