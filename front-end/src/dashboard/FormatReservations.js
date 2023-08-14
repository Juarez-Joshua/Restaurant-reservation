import React from "react";

function FormatReservations({reservation}){
    const {first_name, last_name, mobile_number, reservation_time, people} = reservation
    return <div>
        <h4>Reservation for {first_name + " " +last_name}</h4>
        <p>time: {reservation_time}</p>
        <p>party size: {people}</p>
        <p>phone number: {mobile_number}</p>
    </div>
}

export default FormatReservations;