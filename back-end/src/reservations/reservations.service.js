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
    .whereNot({status: "finished"})
    .orderBy("reservation_time");
}

function readReservation(id) {
  return knex("reservations").select("*").where({ reservation_id: id }).first();
}
function updateReservation(reservationId, newStatus) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .update({ status: newStatus })
}
module.exports = {
  listReservations,
  createReservation,
  reservationsOnDay,
  readReservation,
  updateReservation
};
