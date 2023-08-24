const {
  listReservations,
  createReservation,
  reservationsOnDay,
  readReservation,
  updateReservationStatus,
  searchForNumber,
  changeReservation,
} = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function hasAllValidProperties(req, _res, next) {
  const { data } = req.body;
  if (!data) {
    next({
      status: 400,
      message: "Need data to insert.",
    });
  }
  for (let i = 0; i < VALID_PROPERTIES.length; i++) {
    if (data[VALID_PROPERTIES[i]] && data[VALID_PROPERTIES[i]] != null) {
      continue;
    } else {
      next({
        status: 400,
        message: `Missing field: ${VALID_PROPERTIES[i]}`,
      });
    }
  }
  next();
}
function validateDateTimePeople(req, res, next) {
  const { data } = req.body;
  const dateFormat = /\d{4}-\d{2}-\d{2}/;
  const timeFormat = /\d{2}:\d{2}/;
  if (typeof data.people != "number") {
    next({
      status: 400,
      message: "people needs to be a number",
    });
  }
  if (!dateFormat.test(data.reservation_date)) {
    next({
      status: 400,
      message: "reservation_date needs to be a date",
    });
  }
  if (!timeFormat.test(data.reservation_time)) {
    next({
      status: 400,
      message: "reservation_time needs to be a correct time",
    });
  }
  res.locals.data = data;
  next();
}
function isNotTuesday(_req, res, next) {
  const { reservation_date } = res.locals.data;
  const inputDate = new Date(reservation_date);
  if (inputDate.getDay() === 1) {
    next({
      status: 400,
      message: "We are closed on Tuesdays",
    });
  }
  next();
}
function inFuture(_req, res, next) {
  const { reservation_date, reservation_time } = res.locals.data;
  const inputDate = new Date(`${reservation_date}T${reservation_time}`);
  const currentDate = new Date();
  if (inputDate <= currentDate) {
    next({
      status: 400,
      message: "Reservation date needs to be in the future",
    });
  }
  next();
}
function withinHours(_req, res, next) {
  const { reservation_time } = res.locals.data;
  if (reservation_time < "10:30" || reservation_time > "21:30") {
    next({
      status: 400,
      message: "not within hours",
    });
  }
  next();
}
function hasQuery(req, res, next) {
  const dateFormat = /\d{4}-\d{2}-\d{2}/;
  if (req.query.date && dateFormat.test(req.query.date)) {
    res.locals.date = req.query.date;
  }
  if (req.query.mobile_number) {
    res.locals.mobile_number = req.query.mobile_number;
  }
  next();
}
async function validReservationId(req, res, next) {
  const id = req.params.reservation_Id;
  const reservation = await readReservation(id);
  if (!reservation) {
    next({
      status: 404,
      message: `No reservation with id ${id}`,
    });
  } else {
    res.locals.reservation = reservation;
    next();
  }
}
function reservationUnfinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    next({
      status: 400,
      message: "a finished reservation cannot be updated",
    });
  } else {
    next();
  }
}
function validUpdateStatus(req, res, next) {
  const validStatuses = ["booked", "seated", "finished", "cancelled"];
  const { status } = req.body.data;
  if (validStatuses.includes(status)) {
    next();
  } else {
    next({
      status: 400,
      message: `The status: ${status} is invalid`,
    });
  }
}
function statusIsBooked(req,res,next){
  const {status} = res.locals.data
  if(!status){
    next()
  }else if(status === "booked"){
    next()
  }else{
    next({
      status:400,
      message: `The status ${status} isn't allowed on initial post`
    })
  }
}
async function list(req, res, _next) {
  if (res.locals.date) {
    const data = await reservationsOnDay(res.locals.date);
    res.json({ data });
  } else if (res.locals.mobile_number) {
    const data = await searchForNumber(res.locals.mobile_number);
    res.json({ data });
  } else {
    const data = await listReservations();
    res.json({ data });
  }
}

async function create(req, res, _next) {
  const data = await createReservation(req.body.data);
  res.status(201).json({ data });
}
async function read(req, res, next) {
  res.status(200).json({ data: res.locals.reservation });
}
async function updateStatus(req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  await updateReservationStatus(reservation_id, status);
  res.status(200).json({ data: { status } });
}
async function updateReservation(req, res, next) {
  const data = await changeReservation(req.body.data)
  res.status(200).json({data})
}
module.exports = {
  list: [hasQuery, asyncErrorBoundary(list)],
  create: [
    hasAllValidProperties,
    validateDateTimePeople,
    isNotTuesday,
    inFuture,
    withinHours,
    statusIsBooked,
    asyncErrorBoundary(create),
  ],
  read: [validReservationId, read],
  updateStatus: [
    validReservationId,
    reservationUnfinished,
    validUpdateStatus,
    asyncErrorBoundary(updateStatus),
  ],
  updateReservation: [
    validReservationId,
    hasAllValidProperties,
    validateDateTimePeople,
    isNotTuesday,
    inFuture,
    asyncErrorBoundary(updateReservation),
  ],
};
