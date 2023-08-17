const { listTables, insertTable } = require("./tables.service");

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

async function list(_req, res, _next) {
  const data = await listTables();
  res.json({ data });
}
async function create(_req, res, _next) {
  const data = await insertTable(res.locals.data)
  res.status(201).json({ data });
}

module.exports = { list, create: [hasData, hasTableName, hasCapacity, create] };
