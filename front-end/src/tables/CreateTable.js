import React, { useState } from "react";
import TableForm from "./TableForm";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";
function CreateTable() {
  const [error, setError] = useState(null);
  const history = useHistory();
  const initialForm = {
    table_name: "",
    capacity: 0,
  };
  const submitHandler = async (data) => {
    const abortController = new AbortController();
    try {
      await axios.post(`http://localhost:5001/tables`, {
        data,
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
