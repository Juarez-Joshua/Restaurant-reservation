import React from "react";
import { formatAsTime } from "../utils/date-time";
function FormatReservations({ reservation, showButton }) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_time,
    people,
  } = reservation;
  return (
    <div>
      <h6>Reservation for {first_name + " " + last_name}</h6>
      <p>time: {formatAsTime(reservation_time)}</p>
      <p>party size: {people}</p>
      <p>phone number: {mobile_number}</p>
      {showButton ? (
        <a
          className="btn btn-primary"
          href={`/reservations/${reservation_id}/seat`}
        >
          Seat
        </a>
      ) : (
        ""
      )}
    </div>
  );
}

export default FormatReservations;
