import React, { useState } from "react";

function TableForm({ submitHandler, cancelHandler, initialForm }) {
  const [formData, setFormData] = useState({ ...initialForm });
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitHandler(formData);
  };
  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_name">Table Name:</label>
        <input
          onChange={changeHandler}
          name="table_name"
          id="table_name"
          type="text"
          placeholder=""
          value={formData.table_name}
          required
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
          required
          min={1}
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
