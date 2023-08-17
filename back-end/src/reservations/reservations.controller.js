const {
  listReservations,
  createReservation,
  reservationsOnDay,
  readReservation,
} = require("./reservations.service");

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
  next();
}
function isNotTuesday(req, _res, next) {
  const { reservation_date } = req.body.data;
  const inputDate = new Date(reservation_date);
  if (inputDate.getDay() === 1) {
    next({
      status: 400,
      message: "We are closed on Tuesdays",
    });
  }
  next();
}
function inFuture(req, _res, next) {
  const { reservation_date, reservation_time } = req.body.data;
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
function withinHours(req, _res, next) {
  const { reservation_time } = req.body.data;
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
  next();
}
async function validReservationId(req,res,next){
  const id = req.params.reservation_Id;
  const reservation = await readReservation(id);
  if(!reservation){
    next({
      status:400,
      message:`No reservation with id ${id}`
    })
  }else{
    res.locals.reservation = reservation;
    next()
  }
}
async function list(req, res, _next) {
  if (res.locals.date) {
    const data = await reservationsOnDay(res.locals.date);
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
async function read(req,res,next){
  res.status(200).json({data: res.locals.reservation});
}
module.exports = {
  list: [hasQuery, list],
  create: [
    hasAllValidProperties,
    validateDateTimePeople,
    isNotTuesday,
    inFuture,
    withinHours,
    create,
  ],
  read: [validReservationId, read]
};
