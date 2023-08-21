import React, { useState } from "react";
import FormatOptions from "./TableOptions";
import ErrorAlert from "../layout/ErrorAlert";

function SeatingOptions({
  freeTables,
  capacity,
  initialForm,
  submitHandler,
  cancelHandler,
}) {
  const [formData, setFormData] = useState({ ...initialForm });
  const [error, setError] = useState(null);
  let capacityError;
  const validateSize = () => {
    const table = freeTables.find((e) => e.table_id === formData.table_id);
    if (table.capacity < capacity) {
      capacityError = true;
      setError({ message: "Table isn't big enough for the reservation" });
    } else {
      capacityError = false;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!capacityError) {
      await submitHandler({ ...formData });
    }
  };
  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };
  return (
    <div>
      <ErrorAlert error={error} />
      <h6>Table Options</h6>
      <form onSubmit={handleSubmit}>
        <select
          id="table_id"
          name="table_id"
          onChange={changeHandler}
          value={formData.table_id}
          className="mb-2"
        >
          <option>Select a Table</option>
          {freeTables.map((e) => (
            <FormatOptions
              key={e.table_id}
              table={e}
              validateSize={validateSize}
            />
          ))}
        </select>
        <br />
        <button className="btn btn-primary mr-2" type="submit">
          Submit
        </button>
        <button
          type="cancel"
          className="btn btn-danger"
          onClick={cancelHandler}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SeatingOptions;
