const {
  listTables,
  insertTable,
  readTable,
  seatTable,
} = require("./tables.service");
const { readReservation } = require("../reservations/reservations.service");
function hasData(req, res, next) {
  const { data } = req.body;
  if (!data) {
    next({
      status: 400,
      message: "No data sent",
    });
  } else {
    res.locals.data = data;
    next();
  }
}
function hasTableName(req, res, next) {
  const { table_name } = res.locals.data;
  if (!table_name) {
    next({
      status: 400,
      message: "Need a table_name",
    });
  } else if (table_name.length <= 1) {
    next({
      status: 400,
      message: "table_name isn't long enough",
    });
  } else {
    next();
  }
}
function hasCapacity(req, res, next) {
  const { capacity } = res.locals.data;
  if (!capacity) {
    next({
      status: 400,
      message: "Need a capacity",
    });
  } else if (typeof capacity !== "number") {
    next({
      status: 400,
      message: "Need capacity to be a number",
    });
  } else if (capacity < 1) {
    next({
      status: 400,
      message: "Capacity needs to be at least 1",
    });
  } else {
    next();
  }
}
function hasReservationId(req, res, next) {
  const { reservation_id } = res.locals.data;
  if (!reservation_id) {
    next({
      status: 400,
      message: "Request needs a reservation_id",
    });
  } else {
    res.locals.reservationId = reservation_id;
    next();
  }
}
async function checkReservation(req, res, next) {
  const reservation = await readReservation(res.locals.reservationId);
  if (!reservation) {
    next({
      status: 404,
      message: `No reservation with an ID of ${res.locals.reservationId}`,
    });
  } else if (reservation.people > res.locals.table.capacity) {
    next({
      status: 400,
      message: "Table doesn't have enough capacity",
    });
  }
  next();
}
async function validTable(req, res, next) {
  const tableId = req.params.table_id;
  const table = await readTable(tableId);
  if (!table) {
    next({
      status: 400,
      message: "Not a valid table",
    });
  } else if (table.reservation_id) {
    next({
      status: 400,
      message: "Table is occupied",
    });
  } else {
    res.locals.table = table;
    next();
  }
}
async function list(_req, res, _next) {
  const data = await listTables();
  res.json({ data });
}
async function create(_req, res, _next) {
  const data = await insertTable(res.locals.data);
  res.status(201).json({ data });
}
async function seatReservation(req, res, next) {
  const data = await seatTable(
    res.locals.table.table_id,
    res.locals.reservationId
  );
  res.status(200).json(data);
}
module.exports = {
  list,
  create: [hasData, hasTableName, hasCapacity, create],
  seatReservation: [
    hasData,
    hasReservationId,
    validTable,
    checkReservation,
    seatReservation,
  ],
};
