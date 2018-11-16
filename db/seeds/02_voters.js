
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('voters').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('voters').insert({id: 1,
                              poll_id: 1,
                              voter_token: 123,
                              email: 'erikeh1@gmail.com'}),
        knex('voters').insert({id: 2,
                              poll_id: 1,
                              voter_token: 456,
                              email: 'deventorum@gmail.com'}),
        knex('voters').insert({id: 3,
                              poll_id: 1,
                              voter_token: 789,
                              email: 'alisachuvilskaya@gmail.com'}),
        ]);
    });
};
