import React, { useState } from "react";

function NumberSearchForm({ initialForm , submitHandler}) {
  const [formData, setFormData] = useState({ ...initialForm });
  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitHandler(formData)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile_number" className="mr-2">
          Enter mobile number:
        </label>
        <input
          onChange={changeHandler}
          name="mobile_number"
          id="mobile_number"
          type="text"
          placeholder="Enter a customer's phone number"
          value={formData.mobile_number}
        ></input>
        <button type="submit" className="btn btn-info ml-3">submit</button>
      </form>
    </div>
  );
}

export default NumberSearchForm;
