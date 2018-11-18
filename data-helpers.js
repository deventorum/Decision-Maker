"use strict";

const uuid = require('uuid/v4')


// Defines helper functions for saving and getting tweets, using the database `db`.. (knex)
module.exports = function makeDataHelpers(db) { //db is knex
  return {

    //main page saves the poll info

    // switch to knex (knex uses promises rather than callbacks)
    savePoll: function (pollInfoObj) {
      const admin_token = uuid();
      return db('polls').insert({
          title: pollInfoObj.title,
          description: pollInfoObj.description,
          admin_token: admin_token,
          owner_id: pollInfoObj.owner_id
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

    saveVoter: function (voterInfoObj) {
      const voter_token = uuid();
      return db('voters').insert({
          voter_token: voter_token,
          email: voterInfoObj.email
        })
        .returning('id')
        .catch(err => console.log(err))
        .then((id) => ({
          voter_token: voter_token,
          voter_id: id[0]
        }))
    },

    getAdminVoterToken: function (adminToken, callback) {
      db.select('voter_token').from('voters')
        .join('polls', 'voters.id', '=', 'polls.owner_id')
        .where('admin_token', '=', adminToken)
        .limit(1)
        .asCallback(function (err, result) {
          if (err) callback(err);
          callback(null, result);
        });
    },
    // USE THIS STRUCTURE FOR ANYTHING IN THE FUTURE!
    // USE THIS STRUCTURE FOR ANYTHING IN THE FUTURE!
    // USE THIS STRUCTURE FOR ANYTHING IN THE FUTURE! (BELOW getPollInfo)
    getPollInfo: function (poll_id, callback) {
      db.select('title', 'description', 'voters.email').from('polls')
        .join('voters', 'polls.owner_id', '=', 'voters.id')
        .where('polls.id', '=', poll_id)
        .asCallback(function (err, result) {
          // console.log('this is the result inside the getPollINfo: ', result)
          if (err) callback(err);
          callback(null, result);
        });
    },

      hasVoted: function (voter_token, callback) {
        return db.select('has_voted').from('voters')
        .where('voter_token', '=', voter_token)
        .asCallback(function (err, result) {
          if (err) callback(err);
          callback(null, result);
        });
      },

    //the votes page to show options and save votes
    getOptions: function (poll_id, callback) {
      return db.select('name').from('options')
        .where('poll_id', '=', poll_id)
        .asCallback(function (err, result) {
          if (err) callback(err);
          callback(null, result);
        });
    },

    saveVotes: function (option_name, rate, poll_id) {
      db('votes').insert({
                          option_id: db.select('id').from('options').where('options.name', '=', option_name).andWhere('poll_id', '=', poll_id),
                          rate: rate
                                })
      .then(function () { return db('voters').update({
                                              has_voted: true
                                            })
      })
    },



    //for the stats page
    getResults: function (poll_id, callback) {
      db.select('options.name').sum('votes.rate').from('options')
        .join('votes', 'options.id', '=', 'votes.option_id')
        .where('poll_id', '=', poll_id)
        .groupBy('options.name')
        .asCallback(function (err, result) {
          if (err) callback(err);
          callback(null, result);
        });
      }
  }

}
