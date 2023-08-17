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

function reservationsOnDay(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time")
}

module.exports = {
  listReservations,
  createReservation,
  reservationsOnDay,
};
