"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`.. (knex)
module.exports = function makeDataHelpers(db) {
  return {

    getPolls: function(callback) {
       db.select('created_at').from('polls')
       .where('id', '=', 1)
       .asCallback(function(err, result) {
          if (err) callback(err);
          callback(null,result);
       });
    },


    getOptions: function(callback) {
       db.select('name').from('options')
       .where('poll_id', '=', 1)
       .asCallback(function(err, result) {
          if (err) callback(err);
          callback(null,result);
       });
    },

      saveVotes: function(callback) {
       db.insert('*').from('votes')
       .where('id', '=', 1)
       .asCallback(function(err, result) {
          if (err) callback(err);
          callback(null,result);
       });
    },


      getResults: function(callback) {
       db.select('name').from('options')
       .where('poll_id', '=', 1).join('votes', 'options.id', '=', 'votes.option_id')
       .select('rate')
       .asCallback(function(err, result) {
          if (err) callback(err);
          callback(null,result);
       });

    }
  };
}
