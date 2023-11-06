import React, { useEffect, useState } from "react";
//import { firestore } from "./firebase-config";
import { firestore } from "../Firebase.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const TeamTable = () => {
  const [teams, setTeams] = useState([]);
  //console.log(teams);

  useEffect(() => {
    // Hämta lagdata från Firestore och sortera efter poäng
    const fetchTeamData = async () => {
      const db = getFirestore();
      const teamsRef = collection(db, "Teams");

      const querySnapshot = await getDocs(teamsRef);

      const teamData = [];

      querySnapshot.forEach((doc) => {
        const team = doc.data();
        teamData.push(team);
        //console.log(team);
      });

      // Sortera lag efter poäng i minskande ordning
      teamData.sort((a, b) => b.statistics.points - a.statistics.points);

      setTeams(teamData);
    };

    fetchTeamData();
  }, []);

  return (
    <div>
      <h2>Lagtabell</h2>
      <table>
        <thead className="border-1">
          <tr>
            <th>Lag</th>
            <th>Spelade matcher</th>
            <th>Vinster</th>
            <th>Förluster</th>
            <th>Oavgjorda</th>
            <th>Gjorda mål</th>
            <th>Insläppta mål</th>
            <th>Poäng</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index}>
              <td  className="border-1">{team.name}</td>
              <td  className="border-1">{team.statistics.playedMatches}</td>
              <td  className="border-1">{team.statistics.wins}</td>
              <td  className="border-1">{team.statistics.losses}</td>
              <td  className="border-1">{team.statistics.draws}</td>
              <td  className="border-1">{team.statistics.goalsScored}</td>
              <td  className="border-1">{team.statistics.goalsConceded}</td>
              <td  className="border-1">{team.statistics.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;
