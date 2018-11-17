
exports.up = function(knex, Promise) {
  return knex.schema
    .dropTable('users')
    .createTable('polls', function (table) {
      table.increments('id').unsigned().primary();
      table.string('title');
      table.string ('description');
      table.string('admin_token');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      //table.integer('owner_id').references('id').inTable('voters');

  })

    .createTable('voters', function (table) {
      table.increments('id').unsigned().primary();
      table.integer('poll_id').references('id').inTable('polls');
      table.boolean('has_voted').defaultTo(false);
      table.string('voter_token');
      table.string('email');
    })

    .createTable('options', function (table) {
      table.increments('id').unsigned().primary();
      table.string('name');
      table.integer('poll_id').references('id').inTable('polls');
    })

    .createTable('votes', function (table) {
      table.increments('id').unsigned().primary();
      table.integer('option_id').references('id').inTable('options');
      table.integer('rate');
    });

};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('votes')
    .dropTable('options')
    .dropTable('voters')
    .dropTable('polls')
    .createTable('users', function (table) {
      table.increments('id').unsigned().primary();
    });

};
