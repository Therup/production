import React, { useState } from "react";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Här kan du kolla om användarnamn och lösenord matchar din hårdkodade admininfo
    if (username === "Nisse" && password === "Sport") {
      onLogin(); // Anropa en funktion för att utföra inloggningen
    } else {
      alert("Fel användarnamn eller lösenord.");
    }
  };

  return (
    <div>
      <h2>Admin Inloggning</h2>
      <input
        type="text"
        placeholder="Användarnamn"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Logga in</button>
    </div>
  );
};

export default AdminLogin;
