const knex = require("../db/connection");

function listTables() {
  return knex("tables").select("*").orderBy("table_name");
}
function insertTable(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}
module.exports = { listTables, insertTable };
