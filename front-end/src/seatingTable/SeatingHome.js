import React, { useEffect, useState } from "react";
import SeatingOptions from "./SeatingOptions";
import axios from "axios";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import FormatReservations from "../dashboard/FormatReservations";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
require("dotenv").config();

function SeatingHome() {
  const [error, setError] = useState(null);
  const [tables, setTables] = useState(null);
  const history = useHistory();
  const [reservation, setReservation] = useState();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { reservation_id } = useParams();
  const initialForm = {
    reservation_id,
    table_id: 0,
  };
  useEffect(loadTables, [BASE_URL]);
  function loadTables() {
    axios.get(`${BASE_URL}/tables`).then(({ data }) => {
      setTables(data.data.filter((e) => !e.reservation_id));
    });
  }

  useEffect(loadReservation, [reservation_id, BASE_URL]);
  function loadReservation() {
    axios
      .get(`${BASE_URL}/reservations/${reservation_id}`)
      .then(({ data }) => setReservation(data.data));
  }

  const submitHandler = async (data) => {
    const abortController = new AbortController();
    try {
      await axios.put(`${BASE_URL}/tables/${data.table_id}/seat`, {
        data:{reservation_id: data.reservation_id},
      });
      history.push("/dashboard");
    } catch (error) {
      if (error.name !== "AbortError") {
        const message = error.response.data.error;
        setError({ message });
      }
      return () => abortController.abort();
    }
  };
  const cancelHandler = () => {
    history.goBack();
  };
  return (
    <div>
      <ErrorAlert error={error} />
      <h3>Seating Table</h3>
      {reservation ? (
        <FormatReservations key={reservation_id} reservation={reservation} />
      ) : (
        ""
      )}
      {reservation ? (
        <SeatingOptions
          freeTables={tables}
          capacity={reservation.capacity}
          initialForm={initialForm}
          submitHandler={submitHandler}
          cancelHandler={cancelHandler}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default SeatingHome;
