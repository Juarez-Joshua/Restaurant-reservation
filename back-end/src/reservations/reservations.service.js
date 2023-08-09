const knex = require("../db/connection");

function listReservations() {
  return knex("reservations").select("*");
}

function createReservation(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  listReservations,
  createReservation,
};
