import React, { useState } from "react";
import { formatAsTime } from "../utils/date-time";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
require("dotenv").config();

function FormatReservations({ reservation, showSeat, showEdit, showCancel }) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_time,
    people,
    status,
  } = reservation;
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [error, setError] = useState(null);
  const history = useHistory();

  const cancelReservationHandler = async () => {
    const cancel = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (cancel) {
      const abortController = new AbortController();
      try {
        await axios.put(`${BASE_URL}/reservations/${reservation_id}/status`, {
          data: { status: "cancelled" },
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          const message = error.response.data.error;
          setError({ message });
        }
        return () => abortController.abort();
      }
      history.push("/")
    }
  };
  return (
    <div>
      <ErrorAlert error={error} />
      <h6>Reservation for {first_name + " " + last_name}</h6>
      <p>time: {formatAsTime(reservation_time)}</p>
      <p>party size: {people}</p>
      <p>phone number: {mobile_number}</p>
      <p data-reservation-id-status={reservation.reservation_id}>
        status: {status}
      </p>
      {status === "booked" && showSeat ? (
        <Link
          to={`/reservations/${reservation_id}/seat`}
          className="btn btn-primary mr-2"
          href={`/reservations/${reservation_id}/seat`}
        >
          Seat
        </Link>
      ) : (
        ""
      )}
      {status === "booked" && showEdit ? (
        <Link
          to={`/reservations/${reservation_id}/edit`}
          className="btn btn-secondary mr-2"
          href={`/reservations/${reservation_id}/edit`}
        >
          Edit
        </Link>
      ) : (
        ""
      )}
      {status === "booked" && showCancel ? (
        <button
          data-reservation-id-cancel={reservation.reservation_id}
          className="btn btn-danger"
          onClick={cancelReservationHandler}
        >
          Cancel
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default FormatReservations;
