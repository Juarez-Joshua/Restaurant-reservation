import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import {
  useHistory,
  useRouteMatch,
} from "react-router-dom/cjs/react-router-dom.min";
import { next, previous, today } from "../utils/date-time";
import FormatReservations from "./FormatReservations";
import useQuery from "../utils/useQuery";
import TableFormat from "./TableFormat";
import axios from "axios";
require("dotenv").config();
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const query = useQuery();
  const route = useRouteMatch();
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);
  const [tables, setTables] = useState([]);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  useEffect(() => {
    function getDate() {
      const queryDate = query.get("date");
      if (queryDate) {
        setCurrentDate(queryDate);
      } else {
        setCurrentDate(today());
      }
    }
    getDate();
  }, [query, route]);

  useEffect(loadTables, [BASE_URL]);
  function loadTables() {
    const abortController = new AbortController();
    axios
      .get(`${BASE_URL}/tables`, {
        signal: abortController.signal,
      })
      .then(({ data }) => setTables(data.data))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setReservationsError(error);
        }
      });
    return () => abortController.abort();
  }

  useEffect(loadDashboard, [currentDate]);
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="mt-2">
        <button
          className="mr-2 btn btn-primary"
          onClick={() => {
            history.push(`/dashboard?date=${previous(currentDate)}`);
            setCurrentDate(previous(currentDate));
          }}
        >
          Previous Day
        </button>
        <button
          className="mr-2 btn btn-primary"
          onClick={() => {
            history.push("/dashboard");
          }}
        >
          Today
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            history.push(`/dashboard?date=${next(currentDate)}`);
            setCurrentDate(next(currentDate));
          }}
        >
          Next Day
        </button>
      </div>
      <div className="d-md-flex mb-3">
        <h3 className="mb-0">Reservations for {currentDate}</h3>
      </div>
      <ErrorAlert error={reservationsError} />
      <div className="reservations">
        {reservations.length > 0
          ? reservations.map((e) => (
              <FormatReservations
                key={e.reservation_id}
                reservation={e}
                showSeat={true}
                showEdit={true}
                showCancel={true}
              />
            ))
          : "No reservations today"}
      </div>
      <div className="tables">
        <h4>Tables</h4>
        {tables
          ? tables.map((e) => (
              <TableFormat
                key={e.table_id}
                table={e}
                loadTables={loadTables}
                loadDashboard={loadDashboard}
              />
            ))
          : "No tables"}
      </div>
    </main>
  );
}

export default Dashboard;
