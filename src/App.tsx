import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./components/Login";
import Header from "./components/Header";
import AlertList from "./components/AlertList";
import HistogramChart from "./components/HistogramChart";
import RealTimeChart from "./components/RealTimeChart";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <p>Carregando...</p>;
  }

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div>
      <Header onLogout={() => setIsAuthenticated(false)} />

      <div style={{ marginRight: 50 }}>
        <h2 style={{ marginLeft: 50 }}>
          Medições sonoras
        </h2>
        <RealTimeChart />

        <h2 style={{ marginLeft: 50 }}>
          Histograma
        </h2>
        <HistogramChart />

        <AlertList />
      </div>
    </div>
  );
}

export default App;
