import React, { useState } from "react";

const MatchScorer = ({ team, players, onGoalScored }) => {
  const [scorer, setScorer] = useState("");
  const [goalTime, setGoalTime] = useState("");
  const [goalsScored, setGoalsScored] = useState([]);

  const handleGoalScored = () => {
    if (scorer && goalTime) {
      const goalData = {
        scorer: scorer,
        goalTime: goalTime,
      };
      setGoalsScored([...goalsScored, goalData]);
      onGoalScored(team.name, goalData);

      // Återställ formuläret
      setScorer("");
      setGoalTime("");
    }
  };

  if (!team) {
    return <p>Välj ett lag för att registrera mål.</p>;
  }

  return (
    <div>
      <h3>{team.name}</h3>
      <select value={scorer} onChange={(e) => setScorer(e.target.value)}>
        <option value="">Välj målskytt</option>
        {players.map((player) => (
          <option key={player.id} value={player.name}>
            {player.name}
          </option>
        ))}
      </select>
      <label>
        Måltid:
        <input
          type="text"
          value={goalTime}
          onChange={(e) => setGoalTime(e.target.value)}
        />
      </label>
      <button onClick={handleGoalScored}>Registrera mål</button>
      <ul>
        {goalsScored.map((goal, index) => (
          <li
            key={index}
          >{`Målskytt: ${goal.scorer}, Måltid: ${goal.goalTime}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default MatchScorer;
