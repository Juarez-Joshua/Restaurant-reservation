import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "../createReservations/ReservationForm";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
require("dotenv").config();

function EditReservationHome() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState();
  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(() => {
    async function getReservation(){
      const abortController = new AbortController();
      try {
        const data = await axios.get(
          `${BASE_URL}/reservations/${reservation_id}`,
          { signal: abortController.signal }
        );
  
        setReservation({
          ...data.data.data,
          reservation_date: data.data.data.reservation_date.substring(0, 10),
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error);
        }
      }
      return () => abortController.abort();
    }
    getReservation()
  }, [reservation_id, BASE_URL]);

  const handleSubmit = async (data) => {
    try {
      await axios.put(`${BASE_URL}/reservations/${reservation_id}`, {
        data,
      });
      history.push(`/dashboard?date=${data.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        const message = error.response.data.error;
        setError({ message });
      }
    }
  };
  const gotToPrevious = () => {
    history.goBack();
  };
  return (
    <div>
      <h3>Edit Reservation</h3>
      <ErrorAlert error={error} />
      {reservation ? (
        <ReservationForm
          submitHandler={handleSubmit}
          cancelHandler={gotToPrevious}
          initialForm={{
            ...reservation,
          }}
        />
      ) : null}
    </div>
  );
}

export default EditReservationHome;
