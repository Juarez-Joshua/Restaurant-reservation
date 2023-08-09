import React, { useState } from "react";
import ReservationForm from "./ReservationForm";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
function CreateReservation() {
    //empty form w keys needed
  const initialData = {
    firstName: "",
    lastName: "",
    phoneNum: "",
    date: "",
    time: "",
    partySize: 0,
  };
  //formData that will be updated and submitted
  const [formData, setFormData] = useState({ ...initialData });
  //variable w useHistory ability
  const history = useHistory();
  //how to handle submission
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(formData);
    setFormData({ ...initialData });
  };
  //how to handle a cancel
  const cancelHandler = () => {
    history.push('/dashboard')
}
  return (
    <div>
      <h3>Create a new reservation</h3>
      <ReservationForm 
        submitHandler = {submitHandler}
        cancelHandler = {cancelHandler}
        formData = {formData}
        setFormData = {setFormData}
      />
    </div>
  );
}

export default CreateReservation;
