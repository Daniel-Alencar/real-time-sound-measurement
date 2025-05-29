import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Tipagem para cada entrada no gráfico
interface ChartDataPoint {
  time: string;    // ex: "21:35:49"
  valor: number;   // ex: 60.7
}

// Tipagem dos dados recebidos do Firebase
interface FirebaseEntry {
  data_hora: string;
  microfone: number;
}

const RealTimeChart: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    // Obter data de hoje no formato dd-mm-yyyy
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const currentDate = `${day}-${month}-${year}`;

    const dbRef = ref(database, `${currentDate}/dados_microfone`);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const values = snapshot.val() as Record<string, FirebaseEntry>;

      if (values) {
        const parsedData: ChartDataPoint[] = Object.values(values).map(entry => ({
          time: entry.data_hora,
          valor: entry.microfone
        }));

        setData(parsedData);
      }
    });

    return () => unsubscribe();
  }, []);

  // Mostrar apenas os últimos N pontos
  const ultimosPontos = 20;
  const dadosFiltrados = data.slice(-ultimosPontos);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={dadosFiltrados}>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="valor" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RealTimeChart;
