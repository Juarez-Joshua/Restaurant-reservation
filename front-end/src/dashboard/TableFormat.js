import React, {useState} from "react";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert"
require("dotenv").config();

function TableFormat({ table, loadTables, loadDashboard }) {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [error, setError] = useState(null);
  const finishHandler = async () => {
    const shouldDelete = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (shouldDelete) {
      try {
        await axios.delete(`${BASE_URL}/tables/${table.table_id}/seat`);
        loadTables();
        loadDashboard()
      } catch(error) {setError(error)}
    }
  };
  return (
    <div
      className="border border-secondary mb-2 p-2 "
      data-table-id-status={table.table_id}
    >
      <ErrorAlert error={error} />
      <h6>{table.table_name} </h6>
      <p>Capacity: {table.capacity} </p>
      <p>Status: {table.reservation_id ? "Occupied" : "Free"}</p>
      {table.reservation_id ? (
        <button data-table-id-finish={table.table_id} onClick={finishHandler}>
          Finish
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default TableFormat;
