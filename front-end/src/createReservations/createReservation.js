import React, { useState } from "react";
import ReservationForm from "./ReservationForm";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert";
import {today, formatAsTime} from "../utils/date-time"
function CreateReservation() {
  //empty form w keys needed
  const initialData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };
  //formData that will be updated and submitted
  const [formData, setFormData] = useState({ ...initialData });
  //variable w useHistory ability
  const history = useHistory();
  //how to handle submission
  const [error, setError] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    const formDataCorrectTypes = {
      ...formData,
      people: Number(formData.people),
    };
    if(formData.reservation_date === today()){
      const currentTime = new Date();
      const closingTime = new Date(`${today()}T21:30:00`);
      const reservationTime = new Date(`${today()}T${formatAsTime(formData.reservation_time)}:00`)
      if(currentTime > reservationTime || closingTime < reservationTime){
        setError({message: `Reservation for today must be between ${currentTime} && ${closingTime}`})
      }
    }
    try {
      await axios.post(`http://localhost:5001/reservations`, {
        data: formDataCorrectTypes,
      });
      history.push(`/dashboard?date=${formDataCorrectTypes.reservation_date}`);
    } catch (error) {
      if (error.name !== "AbortError") {
        const message = error.response.data.error;
        // setError({ message });
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
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
}

export default CreateReservation;
