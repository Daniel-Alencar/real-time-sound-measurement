import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Dados de entrada do Firebase
interface FirebaseEntry {
  data_hora: string;
  microfone: number;
}

// Dados de saída para o histograma
interface HistogramBin {
  intervalo: string;
  quantidade: number;
}

const HistogramChart: React.FC = () => {
  const [histogramData, setHistogramData] = useState<HistogramBin[]>([]);

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const currentDate = `${day}-${month}-${year}`;

    const dbRef = ref(database, `${currentDate}/dados_microfone`);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const values = snapshot.val() as Record<string, FirebaseEntry>;

      if (values) {
        const microfoneValues = Object.values(values).map((entry) => entry.microfone);

        // Criar bins (intervalos de 10 unidades de 0 a 100)
        const bins = Array.from({ length: 10 }, (_, i) => ({
          intervalo: `${i * 10}-${i * 10 + 9}`,
          quantidade: 0
        }));

        // Contar quantos valores caem em cada intervalo
        microfoneValues.forEach((valor) => {
          const index = Math.min(Math.floor(valor / 10), bins.length - 1);
          bins[index].quantidade += 1;
        });

        setHistogramData(bins);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={histogramData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="intervalo" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="quantidade" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistogramChart;
