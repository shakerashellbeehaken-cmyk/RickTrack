import { useEffect, useState } from "react";
import "./App.css";

import API from "./api/API";
import Login from "./auth/Login";
import Register from "./auth/Register";

function App() {
  // ✅ ALL HOOKS FIRST (NO CONDITIONS)
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [showRegister, setShowRegister] = useState(false);

  const [number, setNumber] = useState("");
  const [tripType, setTripType] = useState("Home → Office");
  const [rickshaws, setRickshaws] = useState([]);

  // ✅ EFFECT ALWAYS RUNS (LOGIC IS CONDITIONAL)
  useEffect(() => {
    if (loggedIn) {
      fetchRickshaws();
    } else {
      setRickshaws([]); // clear data on logout
    }
  }, [loggedIn]);

  // ---------------- FUNCTIONS ----------------
  const fetchRickshaws = async () => {
    try {
      const res = await API.get("/rickshaws");
      setRickshaws(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addRide = async () => {
    if (!number) return;

    await API.post("/ride", { number, tripType });
    setNumber("");
    fetchRickshaws();
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {}
    localStorage.clear();
    setLoggedIn(false);
  };

  // ---------------- JSX (NO EARLY RETURN) ----------------
  return (
    <div className="app">
      {!loggedIn ? (
        // 🔐 AUTH UI
        <div style={{ padding: 20 }}>
          {showRegister ? (
            <Register onRegister={() => setShowRegister(false)} />
          ) : (
            <Login onLogin={() => setLoggedIn(true)} />
          )}

          <button
            style={{ marginTop: 10 }}
            onClick={() => setShowRegister(!showRegister)}
          >
            {showRegister ? "Go to Login" : "Create Account"}
          </button>
        </div>
      ) : (
        // 🚲 MAIN APP UI
        <div style={{ padding: 20 }}>
            <div className="header">
              {localStorage.getItem("role") === "admin" && <th>User</th>}
            <h1>🚲 RickTrack</h1>
            <button onClick={logout}>Logout</button>
          </div>

          <h2>Mirpur DOHS</h2>
          <h3>
            <i>Add a Ride</i>
          </h3>

          <div className="form">
            <input
              placeholder="Rickshaw Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />

            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
            >
              <option>Home → Office</option>
              <option>Office → Home</option>
            </select>

            <button onClick={addRide}>Add Ride</button>
          </div>

          <hr />

          <table border="1" cellPadding="5">
            <thead>
                <tr>
                  {localStorage.getItem("role") === "admin" && (
                  <td>{r.userId?.name}</td>
                  )}
                <th>Number</th>
                <th>Trip Type</th>
                <th>Total Rides</th>
                <th>Repeats</th>
                <th>Last Ride</th>
              </tr>
            </thead>
            <tbody>
              {rickshaws.map((r) => (
                <tr key={r._id}>
                  <td>{r.number}</td>
                  <td>{r.lastTripType}</td>
                  <td>{r.totalRides}</td>
                  <td>{r.repeatCount}</td>
                  <td>
                    {new Date(r.lastRideDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
