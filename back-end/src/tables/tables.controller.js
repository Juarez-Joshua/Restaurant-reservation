const {listTables} = require("./tables.service")
async function list(req,res,next){
    const data = await listTables()
    res.json({data})
}

module.exports = {list}