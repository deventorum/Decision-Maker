"use strict";

const md5 = require('md5');

// Defines helper functions for saving and getting tweets, using the database `db`.. (knex)
module.exports = function makeDataHelpers(db) { //db is knex
  return {

    // switch to knex (knex uses promises rather than callbacks)
    savePoll: function (pollInfoObj) {
      const admin_token = md5(pollInfoObj.email)
      return db('polls').insert({
          title: pollInfoObj.title,
          description: pollInfoObj.description,
          admin_token: admin_token,
          // don't need email as it's not relevant
        })
        // this returns the poll_id and admin_token
        .returning('id')
        .then(ids => ({
          poll_id: ids[0],
          admin_token: admin_token
        }))
    },

    saveOptions: function (pollOptions) {
      return db('options').insert({
          name: pollOptions.name,
          poll_id: pollOptions.poll_id
        })
        // .then is essential (must have for this to work) 
        .then();
    },
  

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
  }
  // .createTable('options', function (table) {
  //   table.increments('id').unsigned().primary();
  //   table.string('name');
  //   table.integer('poll_id').references('id').inTable('polls');
  // })

}






// }


// saveOptions: function (pollOptions) {
//   console.log(pollOptions.name);
//   const pollOptionsArr = JSON.parse(pollOptions.name);

//   pollOptionsArr.options.forEach(option => {
//     db('options').insert({
//       name: option,
//       poll_id: pollOptions.poll_id
//     })
//   })
// }
