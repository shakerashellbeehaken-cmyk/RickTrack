import { useEffect, useState } from "react";
import API from "../api/API";

export default function RickshawPage({ onLogout }) {
  const role = localStorage.getItem("role");
  const loggedInUserId = localStorage.getItem("userId");

  const [number, setNumber] = useState("");
  const [tripType, setTripType] = useState("");
  const [rickshaws, setRickshaws] = useState([]);

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    number: "",
    lastTripType: "",
    totalRides: 1,
    lastRideDate: "",
  });

  useEffect(() => {
    fetchRickshaws();
  }, []);

  const fetchRickshaws = async () => {
    const res = await API.get("/rickshaws");
    setRickshaws(res.data);
  };

  const addRide = async () => {
    if (!number || !tripType) return;

    await API.post("/ride", { number, tripType });
    setNumber("");
    setTripType("");
    fetchRickshaws();
  };

  // ---------- PERMISSION ----------
  const canModify = (r) => {
  if (role === "admin") return true;

  const rowUserId =
    typeof r.userId === "object" ? r.userId._id : r.userId;

  return rowUserId === loggedInUserId;
};


  // ---------- EDIT ----------
  const startEdit = (r) => {
    setEditingId(r._id);
    setEditData({
      number: r.number,
      lastTripType: r.lastTripType,
      totalRides: r.totalRides,
      lastRideDate: r.lastRideDate?.slice(0, 10),
    });
  };

  const saveEdit = async (id) => {
    await API.put(`/rickshaw/${id}`, editData);
    setEditingId(null);
    fetchRickshaws();
  };

  // ---------- DELETE ----------
  const deleteRickshaw = async (id) => {
    if (!window.confirm("Delete this rickshaw?")) return;
    await API.delete(`/rickshaw/${id}`);
    fetchRickshaws();
  };

  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <div className="header">
        <h1>🚲 RickTrack</h1>
        <button onClick={onLogout}>Logout</button>
      </div>

      {/* ADD FORM */}
      <h3>Add Rickshaw Ride</h3>
      <div className="form">
        <input
          placeholder="Rickshaw Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <input
          placeholder="Trip type (Anywhere → Anywhere)"
          value={tripType}
          onChange={(e) => setTripType(e.target.value)}
        />
        <button onClick={addRide}>Add Ride</button>
      </div>

      <hr />

      {/* TABLE */}
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            {role === "admin" && <th>User</th>}
            <th>Number</th>
            <th>Trip Type</th>
            <th>Total</th>
            <th>Last Ride</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rickshaws.map((r) => (
            <tr key={r._id}>
              {role === "admin" && <td>{r.userId?.name}</td>}

              {/* NUMBER */}
              <td>
                {editingId === r._id ? (
                  <input
                    value={editData.number}
                    onChange={(e) =>
                      setEditData({ ...editData, number: e.target.value })
                    }
                  />
                ) : (
                  r.number
                )}
              </td>

              {/* TRIP TYPE */}
              <td>
                {editingId === r._id ? (
                  <input
                    value={editData.lastTripType}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        lastTripType: e.target.value,
                      })
                    }
                  />
                ) : (
                  r.lastTripType
                )}
              </td>

              {/* TOTAL RIDES */}
              <td>
                {editingId === r._id ? (
                  <input
                    type="number"
                    value={editData.totalRides}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        totalRides: e.target.value,
                      })
                    }
                  />
                ) : (
                  r.totalRides
                )}
              </td>

              {/* DATE */}
              <td>
                {editingId === r._id ? (
                  <input
                    type="date"
                    value={editData.lastRideDate}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        lastRideDate: e.target.value,
                      })
                    }
                  />
                ) : (
                  new Date(r.lastRideDate).toLocaleDateString()
                )}
              </td>

              {/* ACTIONS */}
              <td>
                {canModify(r) &&
                  (editingId === r._id ? (
                    <>
                      <button onClick={() => saveEdit(r._id)}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(r)}>Edit</button>
                      <button onClick={() => deleteRickshaw(r._id)}>
                        Delete
                      </button>
                    </>
                  ))}
              </td>
            </tr>
          ))}
        {/* console.log({
  role,
  loggedInUserId,
  rowUserId: r.userId?._id,
  canModify: canModify(r)}); */}


        </tbody>
      </table>

      <p style={{ fontSize: 12, marginTop: 10 }}>
        *For user's knowledge:  Users can modify only their own rides. Admin can modify all.
      </p>
    </div>
  );
}
