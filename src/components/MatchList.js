import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import MatchItem from "./MatchItem";

const Matches = (isAdmin) => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const matchesRef = collection(db, "matches");
    const teamsRef = collection(db, "Teams");

    const unsubscribeMatches = onSnapshot(
      query(matchesRef, orderBy("date", "desc")),
      (snapshot) => {
        const matchesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMatches(matchesData);
      }
    );

    const unsubscribeTeams = onSnapshot(teamsRef, (snapshot) => {
      const teamsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(teamsData);
    });

    return () => {
      unsubscribeMatches();
      unsubscribeTeams();
    };
  }, []);

  const handleDeleteMatch = async (matchId) => {
    const db = getFirestore();
    const matchRef = doc(db, "matches", matchId);

    try {
      await deleteDoc(matchRef);
      console.log("Match raderad framgångsrikt.");
    } catch (error) {
      console.error("Fel vid radering av match:", error);
    }
  };

  return (
    <div>
      <h2>Spelade matcher</h2>
      {matches.map((match) => (
        <MatchItem
          isAdmin={isAdmin}
          key={match.id}
          matchData={match}
          onDeleteMatch={handleDeleteMatch}
          teams={teams}
        />
      ))}
    </div>
  );
};

export default Matches;
