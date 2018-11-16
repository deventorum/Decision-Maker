exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('polls').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('polls').insert({ id: 1,
                            title: 'What to eat for lunch',
                            description: 'Cant decide what to have for lunch',
                            admin_token: 'erik-test-hungry'
                          }),
        knex('polls').insert({ id: 2,
                            title: 'What color palette',
                            description: 'Cant decide what color',
                            admin_token: 'color-picker'
                          }),
      ]);
    });
};
