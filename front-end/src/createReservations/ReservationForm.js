import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { today, formatAsTime } from "../utils/date-time";
function ReservationForm({
  submitHandler,
  cancelHandler,
  formData,
  setFormData,
}) {
  const [error, setError] = useState(null)
  const changeHandler = ({ target }) => {
    setError(null)
    //if people try to make reservations on past or closed days 
    if (target.name === "reservation_date") {
      const newDate = new Date(target.value);
      if (newDate.getDay() === 2) {
        setError({message: "Closed on Tuesdays"})
      }
      const current = new Date();
      if(newDate < current){
       setError({message: "reservation needs to be in the future"})
      }
    }
    if(target.name === "reservation_time"){
      const openingTime = new Date(`${today()}T10:30:00`)
      const checkTime = new Date(`${today()}T${formatAsTime(target.value)}:00`);
      const closingTime = new Date(`${today()}T21:30`)
      if(openingTime > checkTime || closingTime < checkTime){
        setError({message: "Our reservation hours are between 10:30AM and 9:30PM"})
      }
    }
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  return (
    <div>
      <ErrorAlert error={error} />
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
