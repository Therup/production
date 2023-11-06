import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "./App.css";

import { AppProvider } from "./components/AppContext";
import AddPlayer from "./components/AddPlayerForm";
import AddTeamForm from "./components/AddTeamForm";
import CreateMatchForm from "./components/CreateMatchForm";
import MatchList from "./components/MatchList";
import TeamTable from "./components/TeamTable";
import AdminLogin from "./components/AdminLogin";
import "bootstrap/dist/css/bootstrap.min.css";
import TopScorers from "./components/TopScorers";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [teams, setTeams] = useState([]);
  const [homeTeamGoals, setHomeTeamGoals] = useState([]);
  const [awayTeamGoals, setAwayTeamGoals] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  //console.log(topScorers);

  useEffect(() => {
    // Hämta data från "players" -samlingen i Firestore här
    const fetchTopScorers = async () => {
      const db = getFirestore();
      const playersRef = collection(db, "Players");
      const querySnapshot = await getDocs(playersRef);

      const topScorersData = [];

      querySnapshot.forEach((doc) => {
        const player = doc.data();
        topScorersData.push({
          id: doc.id,
          ...player,
        });
      });

      // Sortera spelarna baserat på antal mål (till exempel)
      topScorersData.sort((a, b) => b.goals - a.goals);

      const top10Scorers = topScorersData.slice(0, 10);

      setTopScorers(top10Scorers);
    };

    fetchTopScorers();
  }, []);

  const handleAdminLogin = () => {
    setIsAdmin(true);
  };
  return (
    <AppProvider>
      <div className="p-3">
        <h1>Ishockeyserie</h1>
        <div className="d-inline-flex d-grid gap-3">
          <div>
            <TeamTable />
            <MatchList isAdmin={isAdmin}></MatchList>
            <TopScorers topScorers={topScorers} />
          </div>
          <div className="w-25">
            <AdminLogin onLogin={handleAdminLogin} />
            {/* {isAdmin && <AddTeamForm></AddTeamForm>}*/}
            {isAdmin && <CreateMatchForm />}
            {isAdmin && <AddPlayer />}
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
