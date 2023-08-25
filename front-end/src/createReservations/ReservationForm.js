import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { today, formatAsTime } from "../utils/date-time";

function ReservationForm({ submitHandler, cancelHandler, initialForm }) {
  const [formData, setFormData] = useState({ ...initialForm });
  const [error, setError] = useState(null);

  const validateDate = () => {
    let dateError = false;
    const newDate = new Date(
      `${formData.reservation_date}T${formatAsTime(
        formData.reservation_time
      )}:00`
    );

    if (newDate.getDay() === 2) {
      setError({ message: "Closed on Tuesdays" });
      dateError = true;
    }
    const current = new Date();
    if (newDate < current) {
      setError({ message: "Needs to be future" });
      dateError = true;
    }
    return dateError;
  };

  const validateTime = () => {
    let timeError = false;
    if (formData.reservation_date === today()) {
      const currentTime = new Date();
      const closingTime = new Date(`${today()}T21:30:00`);
      const reservationTime = new Date(
        `${today()}T${formatAsTime(formData.reservation_time)}:00`
      );
      if (currentTime > reservationTime || closingTime < reservationTime) {
        setError({
          message: "Our reservation hours are between 10:30AM and 9:30PM",
        });
        timeError = true;
      }
    } else {
      const openingTime = new Date(`${today()}T10:30:00`);
      const checkTime = new Date(
        `${today()}T${formatAsTime(formData.reservation_time)}:00`
      );
      const closingTime = new Date(`${today()}T21:30`);
      if (openingTime > checkTime || closingTime < checkTime) {
        setError({
          message: "Our reservation hours are between 10:30AM and 9:30PM",
        });
        timeError = true;
      }
    }
    return timeError;
  };
  const validateMobile = () =>{
    const noLetters = /^[0-9-]+$/.test(formData.mobile_number);
    if(noLetters){
      return false;
    }else{
      setError({message: "Phone number cannot contain letters"});
      return true
    }
  }
  const validateData = () => {
    let dataError = validateDate() || validateTime() || validateMobile();
    return dataError;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateData()) {
      await submitHandler({ ...formData, people: Number(formData.people) });
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
