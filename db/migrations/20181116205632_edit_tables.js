
exports.up = function(knex, Promise) {
  return knex.schema
  .raw('DELETE FROM votes')
  .raw('DELETE FROM options')
  .raw('DELETE FROM polls')
  .raw('DELETE FROM voters')

  .table('polls', function(table) {
    table.integer('owner_id').references('id').inTable('voters');
  })

  .table('voters', function (table) {
    table.dropColumn('poll_id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema

  .table('polls', function(table) {
     table.dropColumn('owner_id');
  })

  .table('voters', function(table) {
    table.integer('poll_id').references('id').inTable('polls');
  })

};
