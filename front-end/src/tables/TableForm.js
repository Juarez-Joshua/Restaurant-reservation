import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";

function TableForm({ submitHandler, cancelHandler, initialForm }) {
  const [formData, setFormData] = useState({ ...initialForm });
  const [error, setError] = useState(null);

  const validateTableName = () => {
    let nameError = false;
    if (formData.table_name.length <= 1) {
      setError({ message: "Table names need at least two characters" });
      nameError = true;
    }
    return nameError;
  };
  const validateCapacity = () => {
    let capacityError = false;
    if (formData.capacity < 1) {
      setError({ message: "Capacity needs to be greater than 1" });
      capacityError = true;
    }
    return capacityError;
  };
  const validateData = () => {
    let dataError = validateCapacity() || validateTableName();
    return dataError;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateData()) {
      await submitHandler({ ...formData, capacity: Number(formData.capacity) });
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
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_name">Table Name:</label>
        <input
          onChange={changeHandler}
          name="table_name"
          id="table_name"
          type="text"
          placeholder=""
          value={formData.table_name}
        ></input>
        <br />
        <label htmlFor="capacity">Capacity:</label>
        <input
          onChange={changeHandler}
          name="capacity"
          id="capacity"
          type="number"
          placeholder=""
          value={formData.capacity}
        ></input>
        <br />
        <button className="btn btn-primary mr-2" type="submit">
          Submit
        </button>
        <button onClick={cancelHandler} className="btn btn-danger">
          Cancel
        </button>
      </form>
    </div>
  );
}

export default TableForm;
