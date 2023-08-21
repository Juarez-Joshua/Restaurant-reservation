import React from "react";

function TableFormat({ table }) {
  console.log(table);
  return (
    <div
      className="border border-secondary mb-2 "
      data-table-id-status={table.table_id}
    >
      <h6>{table.table_name} </h6>
      <p>Capacity: {table.capacity} </p>
      <p>Status: {table.reservation_id ? "Occupied" : "Free"}</p>
    </div>
  );
}

export default TableFormat;
