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
function readTable(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}
function seatTable(tableId, reservationId) {
  return knex("tables")
    .select("*")
    .where({ table_id: tableId })
    .update({ reservation_id: reservationId });
}
module.exports = { listTables, insertTable, readTable, seatTable };
