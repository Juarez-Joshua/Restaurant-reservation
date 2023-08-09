const { listReservations, createReservation } = require("./reservations.service");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function hasAllValidProperties(req, _res, next) {
  const {data} = req.body
  if(!data){
    next({
      status:400,
      message:"Need data to insert."
    })
  }
  for(let i = 0; i < VALID_PROPERTIES.length; i++){
    if(data[VALID_PROPERTIES[i]] && data[VALID_PROPERTIES[i]] != null)continue
    else{
      next({
        status:400,
        message:`Missing field: ${VALID_PROPERTIES[i]}`
      })
    }
  }
  next()
}
function validateDateTimePeople(req,res,next){

}
async function list(_req, res, _next) {
  const data = await listReservations();
  res.json({ data });
}

async function create(req, res, _next) {
    const data = await createReservation(req.body.data);
    res.status(201).json({data});
}

module.exports = {
  list,
  create: [hasAllValidProperties, create],
};
