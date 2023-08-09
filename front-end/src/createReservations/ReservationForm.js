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
    console.log(formData);
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <label htmlFor="firstName">First name: </label>
        <input
          onChange={changeHandler}
          name="firstName"
          id="firstName"
          type="name"
          placeholder=""
          value={formData.firstName}
        ></input>
        <br />
        <label htmlFor="lastName">Last name: </label>
        <input
          onChange={changeHandler}
          name="lastName"
          id="lastName"
          type="name"
          placeholder=""
          value={formData.lastName}
        ></input>
        <br />
        <label htmlFor="phoneNum">Phone number:</label>
        <input
          onChange={changeHandler}
          name="phoneNum"
          id="phoneNum"
          type="phone number"
          placeholder=""
          value={formData.phoneNum}
        ></input>
        <br />
        <label htmlFor="date">Date:</label>
        <input
          onChange={changeHandler}
          name="date"
          id="date"
          type="date"
          placeholder=""
          value={formData.date}
        ></input>
        <br />
        <label htmlFor="time">Time:</label>
        <input
          onChange={changeHandler}
          name="time"
          id="time"
          type="time"
          placeholder=""
          value={formData.time}
        ></input>
        <br />
        <label htmlFor="partySize">Party size (minimum 1):</label>
        <input
          onChange={changeHandler}
          name="partySize"
          id="partySize"
          type="number"
          placeholder=""
          value={formData.partySize}
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
