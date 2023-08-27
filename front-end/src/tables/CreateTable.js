import React, { useState } from "react";
import TableForm from "./TableForm";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";
require("dotenv").config();

function CreateTable() {
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [error, setError] = useState(null);
  const history = useHistory();
  const initialForm = {
    table_name: "",
    capacity: 0,
  };
  const submitHandler = async (data) => {
    try {
      await axios.post(`${BASE_URL}/tables`, {
        data,
      });
      history.push("/dashboard");
    } catch (error) {
      if (error.name !== "AbortError") {
        const message = error.response.data.error;
        setError({ message });
      }
    }
  };
  const cancelHandler = () => {
    history.goBack();
  };
  return (
    <div>
      <ErrorAlert error={error} />
      <h3>Create Table</h3>
      <TableForm
        submitHandler={submitHandler}
        cancelHandler={cancelHandler}
        initialForm={initialForm}
      />
    </div>
  );
}

export default CreateTable;
