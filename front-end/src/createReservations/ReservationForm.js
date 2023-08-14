import React from "react";

function ReservationForm({
  submitHandler,
  cancelHandler,
  formData,
  setFormData,
}) {
  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="first_name">First name: </label>
        <input
          onChange={changeHandler}
          name="first_name"
          id="first_name"
          type="name"
          placeholder=""
          value={formData.first_name}
          required
        ></input>
        <br />
        <label htmlFor="last_name">Last name: </label>
        <input
          onChange={changeHandler}
          name="last_name"
          id="last_name"
          type="name"
          placeholder=""
          value={formData.last_name}
          required
        ></input>
        <br />
        <label htmlFor="mobile_number">Phone number:</label>
        <input
          onChange={changeHandler}
          name="mobile_number"
          id="mobile_number"
          type="text"
          pattern="^\d{3}-\d{3}-\d{4}$"
          placeholder=""
          value={formData.mobile_number}
          required
        ></input>
        <br />
        <label htmlFor="reservation_date">date:</label>
        <input
          onChange={changeHandler}
          name="reservation_date"
          id="reservation_date"
          type="date"
          placeholder=""
          value={formData.reservation_date}
          required
        ></input>
        <br />
        <label htmlFor="reservation_time">Time:</label>
        <input
          onChange={changeHandler}
          name="reservation_time"
          id="reservation_time"
          type="time"
          placeholder=""
          value={formData.reservation_time}
          required
        ></input>
        <br />
        <label htmlFor="people">Party size (minimum 1):</label>
        <input
          onChange={changeHandler}
          name="people"
          id="people"
          type="number"
          placeholder=""
          value={formData.people}
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

export default ReservationForm;
