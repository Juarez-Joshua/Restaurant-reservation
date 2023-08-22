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
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function readReservation(id) {
  return knex("reservations").select("*").where({ reservation_id: id }).first();
}
function updateReservationStatus(reservationId, newStatus) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .update({ status: newStatus });
}
function searchForNumber(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}
function changeReservation(updatedReservation){
  return knex("reservations")
    .select("*")
    .where({reservation_id: updatedReservation.reservation_id})
    .update(updatedReservation, "*")
    .then((updatedRecords) => updatedRecords[0])
}
module.exports = {
  listReservations,
  createReservation,
  reservationsOnDay,
  readReservation,
  updateReservationStatus,
  searchForNumber,
  changeReservation,
};
