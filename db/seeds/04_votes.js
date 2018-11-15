
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('votes').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('votes').insert({id: 1,
                              option_id: 1,
                              rate: 3}),
        knex('votes').insert({id: 2,
                              option_id: 2,
                              rate: 2}),
      ]);
    });
};
