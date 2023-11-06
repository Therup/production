import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const AddTeamForm = () => {
  const [teamName, setTeamName] = useState("");
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [draws, setDraws] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Skapa ett objekt med laginformation
    const teamData = {
      name: teamName,
      statistics: {
        wins,
        losses,
        draws,
      },
    };

    try {
      // Skicka lagdata till Firestore
      const db = getFirestore();
      const teamsRef = collection(db, "Teams"); // Använd stor bokstav 'T'
      await addDoc(teamsRef, teamData);

      // Återställ formuläret efter att laget har lagts till
      setTeamName("");
      setWins(0);
      setLosses(0);
      setDraws(0);
    } catch (error) {
      console.error("Fel vid tillägg av lag:", error);
    }
  };

  return (
    <div>
      <h2>Lägg till ett nytt lag</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Lagets namn:
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </label>
        <label>
          Vinster:
          <input
            type="number"
            value={wins}
            onChange={(e) => setWins(e.target.value)}
          />
        </label>
        <label>
          Förluster:
          <input
            type="number"
            value={losses}
            onChange={(e) => setLosses(e.target.value)}
          />
        </label>
        <label>
          Oavgjorda:
          <input
            type="number"
            value={draws}
            onChange={(e) => setDraws(e.target.value)}
          />
        </label>
        <button type="submit">Lägg till lag</button>
      </form>
    </div>
  );
};

export default AddTeamForm;
