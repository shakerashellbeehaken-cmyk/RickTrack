import { useState } from "react";
import "./App.css";

import Login from "./auth/Login";
import Register from "./auth/Register";
import RickshawPage from "./pages/RickshawPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [showRegister, setShowRegister] = useState(false);

  const logout = async () => {
    try {
      // optional backend logout
      await fetch("http://localhost:5001/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch {}

    localStorage.clear();
    setLoggedIn(false);
  };

  // AUTH SCREENS
  if (!loggedIn) {
    return (
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
    );
  }

  // MAIN APP
  return <RickshawPage onLogout={logout} />;
}

export default App;
