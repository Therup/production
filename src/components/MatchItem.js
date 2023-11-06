import React from "react";
import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";

const MatchItem = ({ matchData, onDeleteMatch, isAdmin }) => {
  console.log(isAdmin);
  const handleDeleteMatch = async (matchId) => {
    const db = getFirestore();
    const matchRef = doc(db, "matches", matchId);

    try {
      await deleteDoc(matchRef);
      console.log("Match raderad framgångsrikt.");
      onDeleteMatch(matchId); // Skicka match-ID till förälderkomponenten för att uppdatera listan.
    } catch (error) {
      console.error("Fel vid radering av match:", error);
    }
  };

  return (
    <div>
      <p>
        {matchData.homeTeam}-{matchData.awayTeam}: {matchData.result.homeScore}{" "}
        - {matchData.result.awayScore}{" "}
        {isAdmin.isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => handleDeleteMatch(matchData.id)}
          >
            Ta bort match
          </button>
        )}
      </p>
    </div>
  );
};

export default MatchItem;
