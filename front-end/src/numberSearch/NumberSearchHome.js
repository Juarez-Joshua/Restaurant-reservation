import React, { useState } from "react";
import NumberSearchForm from "./NumberSearchForm";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert";
import FormatReservations from "../dashboard/FormatReservations";
require("dotenv").config();
function NumberSearchHome() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const initialForm = {
    mobile_number: "",
  };
  const [attemptedSearch, setAttemptedSearch] = useState(false);
  const [foundReservations, setFoundReservations] = useState([]);
  const [error, setError] = useState(null);

  const submitHandler = async (data) => {
    try {
      const results = await axios.get(
        `${BASE_URL}/reservations?mobile_number=${data.mobile_number}`
      );
      setFoundReservations(results.data.data);
      setAttemptedSearch(true);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
  };
  return (
    <div>
      <h3>Search For Reservation</h3>
      <ErrorAlert error={error} />
      <NumberSearchForm
        initialForm={initialForm}
        submitHandler={submitHandler}
      />
      {attemptedSearch && foundReservations.length < 1 ? (
        <p>No reservations found</p>
      ) : null}
      {attemptedSearch && foundReservations.length > 0
        ? foundReservations.map((e) => {
            return (
              <FormatReservations
                key={e.reservation_id}
                reservation={e}
                showCancel={true}
                showEdit={true}
              />
            );
          })
        : null}
    </div>
  );
}

export default NumberSearchHome;
