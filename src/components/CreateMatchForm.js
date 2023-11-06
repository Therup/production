import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  FieldValue,
} from "firebase/firestore";
import { Timestamp, arrayUnion } from "firebase/firestore";
import MatchScorer from "./MatchScorer";

const CreateMatchForm = () => {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [teams, setTeams] = useState([]);
  const [selectedHomeTeam, setSelectedHomeTeam] = useState(null);
  const [selectedAwayTeam, setSelectedAwayTeam] = useState(null);
  const [selectedHomeTeamPlayers, setSelectedHomeTeamPlayers] = useState([]);
  const [selectedAwayTeamPlayers, setSelectedAwayTeamPlayers] = useState([]);
  const [homeTeamGoals, setHomeTeamGoals] = useState([]);
  const [awayTeamGoals, setAwayTeamGoals] = useState([]);
  console.log(teams);
  console.log(homeTeamGoals);

  useEffect(() => {
    const fetchTeamData = async () => {
      const db = getFirestore();
      const teamsRef = collection(db, "Teams");
      const querySnapshot = await getDocs(teamsRef);

      const teamData = [];

      querySnapshot.forEach((doc) => {
        const team = doc.data();
        teamData.push({
          id: doc.id,
          ...team,
        });
      });

      setTeams(teamData);
    };

    fetchTeamData();
  }, []);

  const handleGoalChange = (player, team, event) => {
    const goals = team === "home" ? [...homeTeamGoals] : [...awayTeamGoals];
    const index = goals.findIndex((goal) => goal.player === player);

    if (index !== -1) {
      goals[index].goals = parseInt(event.target.value);
    } else {
      goals.push({ player, goals: parseInt(event.target.value) });
    }

    if (team === "home") {
      setHomeTeamGoals(goals);

      // Hitta det aktuella teamet
      const team = teams.find((t) => t.name === homeTeam);

      if (team) {
        // Hitta den aktuella spelaren inom teamet baserat på namn
        const selectedPlayer = team.players.find((p) => p.name === player);

        if (selectedPlayer) {
          // Uppdatera målen för den valda spelaren i Firestore
          updatePlayerGoalsInFirestore(selectedPlayer, event.target.value);
        }
      }
    } else {
      setAwayTeamGoals(goals);

      // Hitta det aktuella teamet
      const team = teams.find((t) => t.name === awayTeam);

      if (team) {
        // Hitta den aktuella spelaren inom teamet baserat på namn
        const selectedPlayer = team.players.find((p) => p.name === player);

        if (selectedPlayer) {
          // Uppdatera målen för den valda spelaren i Firestore
          updatePlayerGoalsInFirestore(selectedPlayer, event.target.value);
        }
      }
    }
  };

  const updatePlayerGoalsInFirestore = async (player, newGoals) => {
    const db = getFirestore();
    const playerDocRef = doc(db, "Players", player.id); // Använd spelarens ID

    // Uppdatera målen i Firestore
    const playerData = {
      goals: parseInt(newGoals),
    };

    // Uppdatera dokumentet i Firestore
    await updateDoc(playerDocRef, playerData);
  };

  const updateHomeTeamInBackend = async (
    selectedHomeTeam,
    homeScore,
    awayScore
  ) => {
    const db = getFirestore();
    const homeTeamDocRef = doc(db, "Teams", selectedHomeTeam.id);

    const homeTeamStatistics = selectedHomeTeam.statistics || {
      wins: 0,
      losses: 0,
      draws: 0,
      goalsScored: 0,
      goalsConceded: 0,
      points: 0,
      playedMatches: 0,
    };

    if (homeScore > awayScore) {
      homeTeamStatistics.wins += 1;
      homeTeamStatistics.points += 3;
    } else if (homeScore < awayScore) {
      homeTeamStatistics.losses += 1;
    } else {
      homeTeamStatistics.draws += 1;
      homeTeamStatistics.points += 1;
    }

    homeTeamStatistics.goalsScored += homeScore;
    homeTeamStatistics.goalsConceded += awayScore;
    homeTeamStatistics.playedMatches += 1;

    await updateDoc(homeTeamDocRef, { statistics: homeTeamStatistics });
  };

  const updateAwayTeamInBackend = async (
    selectedAwayTeam,
    homeScore,
    awayScore
  ) => {
    const db = getFirestore();
    const awayTeamDocRef = doc(db, "Teams", selectedAwayTeam.id);

    const awayTeamStatistics = selectedAwayTeam.statistics || {
      wins: 0,
      losses: 0,
      draws: 0,
      goalsScored: 0,
      goalsConceded: 0,
      points: 0,
      playedMatches: 0,
    };

    if (homeScore < awayScore) {
      awayTeamStatistics.wins += 1;
      awayTeamStatistics.points += 3;
    } else if (homeScore > awayScore) {
      awayTeamStatistics.losses += 1;
    } else {
      awayTeamStatistics.draws += 1;
      awayTeamStatistics.points += 1;
    }

    awayTeamStatistics.goalsScored += awayScore;
    awayTeamStatistics.goalsConceded += homeScore;
    awayTeamStatistics.playedMatches += 1;

    await updateDoc(awayTeamDocRef, { statistics: awayTeamStatistics });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedHomeTeam = teams.find((team) => team.name === homeTeam);
    const selectedAwayTeam = teams.find((team) => team.name === awayTeam);

    // Skapa matchdata
    const matchData = {
      homeTeam: selectedHomeTeam.name,
      awayTeam: selectedAwayTeam.name,
      date: Timestamp.fromDate(new Date()),
      result: {
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
      },
      homeTeamGoals,
      awayTeamGoals,
    };

    // Uppdatera lagstatistik i backend
    await updateHomeTeamInBackend(selectedHomeTeam, homeScore, awayScore);
    await updateAwayTeamInBackend(selectedAwayTeam, homeScore, awayScore);

    // Spara matchdata i Firestore (eller din databas)
    const db = getFirestore();
    const matchesRef = collection(db, "matches");
    await addDoc(matchesRef, matchData);

    // Återställ formuläret
    setHomeTeam("");
    setAwayTeam("");
    setHomeScore(0);
    setAwayScore(0);
    setSelectedHomeTeamPlayers([]);
    setSelectedAwayTeamPlayers([]);
    setHomeTeamGoals([]);
    setAwayTeamGoals([]);

    // Uppdatera "teams" efter att matchen har lagts till
    const updatedTeams = teams.map((team) => {
      if (team.name === homeTeam) {
        return {
          ...team,
          players: team.players.map((player) => ({
            ...player,
            goals:
              homeTeamGoals.find((goal) => goal.player === player.name)
                ?.goals || 0,
          })),
        };
      } else if (team.name === awayTeam) {
        return {
          ...team,
          players: team.players.map((player) => ({
            ...player,
            goals:
              awayTeamGoals.find((goal) => player.name === goal.player)
                ?.goals || 0,
          })),
        };
      } else {
        return team;
      }
    });

    setTeams(updatedTeams);
  };

  return (
    <div>
      <h2>Skapa en ny match</h2>
      <form onSubmit={handleSubmit}>
        {/* Välj hemmalag */}
        <label>
          <select
            value={homeTeam}
            onChange={(e) => {
              const selectedTeam = teams.find(
                (team) => team.name === e.target.value
              );
              setHomeTeam(e.target.value);

              if (
                selectedTeam &&
                Array.isArray(selectedTeam.players) &&
                selectedTeam.players.length > 0
              ) {
                setSelectedHomeTeamPlayers(
                  selectedTeam.players.map((player) => player.name)
                );
              } else {
                setSelectedHomeTeamPlayers([]); // Återställ listan om det inte finns några spelare eller om det inte är en array
              }
            }}
          >
            <option value="">Välj hemmalag</option>
            {teams.map((team) => (
              <option key={team.id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
        </label>

        {/* Välj spelare från hemmalaget */}
        {homeTeam && (
          <label>
            Välj spelare från hemmalaget:
            <select
              multiple
              value={selectedHomeTeamPlayers}
              onChange={(e) => {
                setSelectedHomeTeamPlayers(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                );
              }}
            >
              {selectedHomeTeamPlayers.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Ange antal mål för hemmalagets spelare */}
        {selectedHomeTeamPlayers.length > 0 && (
          <label>
            Ange antal mål för hemmalagets spelare:
            {selectedHomeTeamPlayers.map((player) => (
              <div key={player}>
                <span>{player}:</span>
                <input
                  type="number"
                  min="0"
                  value={
                    homeTeamGoals.find((goal) => goal.player === player)
                      ?.goals || 0
                  }
                  onChange={(e) => handleGoalChange(player, "home", e)}
                />
              </div>
            ))}
          </label>
        )}

        {/* Ange bortagelag */}
        <label>
          <select
            value={awayTeam}
            onChange={(e) => {
              const selectedTeam = teams.find(
                (team) => team.name === e.target.value
              );
              setAwayTeam(e.target.value);

              if (
                selectedTeam &&
                Array.isArray(selectedTeam.players) &&
                selectedTeam.players.length > 0
              ) {
                setSelectedAwayTeamPlayers(
                  selectedTeam.players.map((player) => player.name)
                );
              } else {
                setSelectedAwayTeamPlayers([]); // Återställ listan om det inte finns några spelare eller om det inte är en array
              }
            }}
          >
            <option value="">Välj bortagelag</option>
            {teams.map((team) => (
              <option key={team.id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
        </label>

        {/* Välj spelare från bortagelaget */}
        {awayTeam && (
          <label>
            Välj spelare från bortagelaget:
            <select
              multiple
              value={selectedAwayTeamPlayers}
              onChange={(e) => {
                setSelectedAwayTeamPlayers(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                );
              }}
            >
              {selectedAwayTeamPlayers.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Ange antal mål för bortagelagets spelare */}
        {selectedAwayTeamPlayers.length > 0 && (
          <label>
            Ange antal mål för bortagelagets spelare:
            {selectedAwayTeamPlayers.map((player) => (
              <div key={player}>
                <span>{player}:</span>
                <input
                  type="number"
                  min="0"
                  value={
                    awayTeamGoals.find((goal) => goal.player === player)
                      ?.goals || 0
                  }
                  onChange={(e) => handleGoalChange(player, "away", e)}
                />
              </div>
            ))}
          </label>
        )}

        {/* Ange resultat (vinnare) */}
        <label>
          Resultat (Vinnare):
          <input
            type="number"
            value={homeScore}
            onChange={(e) => setHomeScore(Number(e.target.value))}
          />
        </label>
        <label>
          Resultat (Förlorare):
          <input
            type="number"
            value={awayScore}
            onChange={(e) => setAwayScore(Number(e.target.value))}
          />
        </label>
        <button type="submit">Skapa match</button>
      </form>
    </div>
  );
};

export default CreateMatchForm;
