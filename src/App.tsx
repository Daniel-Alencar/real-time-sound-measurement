import AlertList from "./components/AlertList";
import HistogramChart from "./components/HistogramChart";
import RealTimeChart from "./components/RealTimeChart";

function App() {
  return (
    <div style={{ marginRight: 50 }}>
      <h2 style={{ marginLeft: 50 }}>
        Medições sonoras
      </h2>
      <RealTimeChart />
      <h2 style={{ marginLeft: 50 }}>
        Histograma de hoje
      </h2>
      <HistogramChart />
      <AlertList />
    </div>
  );
}

export default App;
