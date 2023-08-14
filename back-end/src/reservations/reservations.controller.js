const {
  listReservations,
  createReservation,
  reservationsOnDay,
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
    if (data[VALID_PROPERTIES[i]] && data[VALID_PROPERTIES[i]] != null)
      continue;
    else {
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
function hasQuery(req, res, next) {
  const dateFormat = /\d{4}-\d{2}-\d{2}/;
  if (req.query.date && dateFormat.test(req.query.date)) {
    res.locals.date = req.query.date;
  }
  next();
}

async function list(req, res, _next) {
  if (res.locals.date) {
    const data = await reservationsOnDay(res.locals.date);
    data.sort((a, b) => {
      return a.reservation_time.localeCompare(b.reservation_time);
    });
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

module.exports = {
  list: [hasQuery, list],
  create: [hasAllValidProperties, validateDateTimePeople, create],
};
