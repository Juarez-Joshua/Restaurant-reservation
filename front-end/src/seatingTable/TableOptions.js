import React from "react";

function TableOptions({table, validateSize}){
    return <option value={table.table_id} onClick={validateSize}>{table.table_name} - {table.capacity}</option>
}

export default TableOptions