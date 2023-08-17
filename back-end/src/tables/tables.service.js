const knex = require("../db/connection");

function listTables(){
    return knex("tables").select("*")
}

module.exports = {listTables,}