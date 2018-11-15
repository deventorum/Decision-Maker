
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('options').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('options').insert({id: 1,
                                name: 'pizza',
                                poll_id: 1}),
        knex('options').insert({id: 2,
                                name: 'sushi',
                                poll_id: 1}),
        knex('options').insert({id: 3,
                                name: 'cake',
                                poll_id: 1}),
        knex('options').insert({id: 4,
                                name: 'burgers',
                                poll_id: 1}),
      ]);
    });
};
