import React from "react";
import { formatAsTime } from "../utils/date-time";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
function FormatReservations({ reservation, showButton }) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_time,
    people,
    status,
  } = reservation;
  return (
    <div>
      <h6>Reservation for {first_name + " " + last_name}</h6>
      <p>time: {formatAsTime(reservation_time)}</p>
      <p>party size: {people}</p>
      <p>phone number: {mobile_number}</p>
      <p data-reservation-id-status={reservation.reservation_id}>
        status: {status}
      </p>
      {status === "booked" ? (
        <Link
          to={`/reservations/${reservation_id}/seat`}
          className="btn btn-primary"
          href={`/reservations/${reservation_id}/seat`}
        >
          Seat
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}

export default FormatReservations;
