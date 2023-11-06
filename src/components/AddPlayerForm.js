import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

const AddPlayer = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    const fetchTeamData = async () => {
      const db = getFirestore();
      const teamsRef = collection(db, "Teams");
      const querySnapshot = await getDocs(teamsRef);

      const teamsData = [];

      querySnapshot.forEach((doc) => {
        const team = doc.data();
        teamsData.push({
          id: doc.id,
          ...team,
        });
      });

      setTeams(teamsData);
    };

    fetchTeamData();
  }, []);

  const handlePlayerAdded = async () => {
    if (!selectedTeam || !playerName) {
      console.error("Du måste välja ett lag och ange spelarens namn.");
      return;
    }

    try {
      const db = getFirestore();

      const playerRef = await addDoc(collection(db, "Players"), {
        name: playerName,
        team: selectedTeam,
      });

      const playerData = {
        id: playerRef.id,
        name: playerName,
      };

      // Uppdatera lagobjektet i state med den nya spelaren
      setTeams((prevTeams) =>
        prevTeams.map((team) => {
          if (team.name === selectedTeam) {
            // Uppdatera lagdokumentet i Firestore med den nya spelaren
            const teamDocRef = doc(db, "Teams", team.id);
            updateDoc(teamDocRef, {
              players: [...(team.players || []), playerData],
            });

            return {
              ...team,
              players: [...(team.players || []), playerData],
            };
          }
          return team;
        })
      );

      setSelectedTeam("");
      setPlayerName("");
    } catch (error) {
      console.error("Fel vid tillägg av spelare:", error);
    }
  };

  return (
    <div>
      <h2>Lägg till spelare</h2>
      <div>
        <h3>Lägg till spelare till ett lag</h3>
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="">Välj lag</option>
          {teams.map((team) => (
            <option key={team.id} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Spelarens namn"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={handlePlayerAdded}>Lägg till spelare</button>
      </div>

      {teams.map((team) => (
        <div key={team.id}>
          <h3>{team.name}</h3>
          <ul>
            {team.players ? (
              team.players.map((player) => (
                <li key={player.id}>{player.name}</li>
              ))
            ) : (
              <p>Inga spelare tillagda i detta lag.</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AddPlayer;
