import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import CreateMatchForm from "./CreateMatchForm";

const TopScorers = (topScorers) => {
  return (
    <div>
      <h2>Skytteliga</h2>
      <ul>
        {topScorers.topScorers.map((player, index) => (
          <li key={player.id}>
            {index + 1}. {player.name} - Mål: {player.goals} - Lag:{" "}
            {player.team}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopScorers;
