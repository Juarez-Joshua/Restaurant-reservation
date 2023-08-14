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
      <div className="d-md-flex mb-3">
        <h3 className="mb-0">Reservations for {currentDate}</h3>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.length > 0
        ? reservations.map((e) => <FormatReservations key ={e.reservation_id}reservation={e} />)
        : "No reservations today"}
      <div>
        <button
          onClick={() => {
            history.push(`/dashboard?date=${previous(currentDate)}`);
            setCurrentDate(previous(currentDate));
          }}
        >
          Previous Day
        </button>
        <button
          onClick={() => {
            history.push(`/dashboard?date=${next(currentDate)}`);
            setCurrentDate(next(currentDate));
          }}
        >
          Next Day
        </button>
      </div>
    </main>
  );
}

export default Dashboard;
