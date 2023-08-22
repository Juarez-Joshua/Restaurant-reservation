import React, { useState } from "react";
import ReservationForm from "./ReservationForm";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();

function CreateReservation() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  //empty form w keys needed
  const initialData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  //variable w useHistory ability
  const history = useHistory();
  //how to handle submission
  const [error, setError] = useState(null);

  const submitHandler = async (data) => {
    const abortController = new AbortController();
    try {
      await axios.post(`${BASE_URL}/reservations`, {
        data
      });
      history.push(`/dashboard?date=${data.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        const message = error.response.data.error;
        setError({ message });
      }
      return () => abortController.abort();
    }
  };

  //how to handle a cancel
  const cancelHandler = () => {
    history.goBack();
  };
  return (
    <div>
      <h3>Create a new reservation</h3>
      <ErrorAlert error={error} />
      <ReservationForm
        submitHandler={submitHandler}
        cancelHandler={cancelHandler}
        initialForm={initialData}
      />
    </div>
  );
}

export default CreateReservation;
