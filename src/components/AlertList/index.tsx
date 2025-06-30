import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";

// Estrutura dos dados vindos do Firebase
interface FirebaseEntry {
  data_hora: string; // Ex: "14:23:05"
  microfone: number; // Ex: 85.1
}

interface Alerta {
  horario: string;
  mensagem: string;
}

const DELAY_SOUND_MEASUREMENT_MS = 1000;

const LIMITE_DB = 60;
const TEMPO_MINIMO_SEGUNDOS = 2;

const TEMPO_MINIMO = TEMPO_MINIMO_SEGUNDOS * 1000 / DELAY_SOUND_MEASUREMENT_MS;

const AlertList: React.FC = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  useEffect(() => {
    const today = new Date();
    const dia = String(today.getDate()).padStart(2, "0");
    const mes = String(today.getMonth() + 1).padStart(2, "0");
    const ano = today.getFullYear();
    const currentDate = `${dia}-${mes}-${ano}`;

    const dbRef = ref(database, `${currentDate}/dados_microfone`);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const values = snapshot.val() as Record<string, FirebaseEntry>;
      if (!values) return;

      const entradasOrdenadas = Object.values(values)
        .sort((a, b) => a.data_hora.localeCompare(b.data_hora));

      const alertasDetectados: Alerta[] = [];
      let sequencia: FirebaseEntry[] = [];

      entradasOrdenadas.forEach((entry, index) => {
        if (entry.microfone > LIMITE_DB) {
          sequencia.push(entry);
        } else {
          if (sequencia.length >= TEMPO_MINIMO) {
            const primeiro = sequencia[0];
            const alerta: Alerta = {
              horario: primeiro.data_hora,
              mensagem: `No dia ${currentDate} no horário ${primeiro.data_hora}, as medições ultrapassaram ${LIMITE_DB}dB por cerca de ${TEMPO_MINIMO_SEGUNDOS}s`
            };

            // Evita duplicatas (baseado no horário da primeira ocorrência)
            if (!alertasDetectados.some(a => a.horario === alerta.horario)) {
              alertasDetectados.push(alerta);
            }
          }
          sequencia = [];
        }

        // Verifica no fim do array se ainda há uma sequência válida
        if (
          index === entradasOrdenadas.length - 1 && 
          sequencia.length >= TEMPO_MINIMO
        ) {
          const primeiro = sequencia[0];
          const alerta: Alerta = {
            horario: primeiro.data_hora,
            mensagem: `No dia ${currentDate} no horário ${primeiro.data_hora}, as medições ultrapassaram ${LIMITE_DB}dB por cerca de ${TEMPO_MINIMO_SEGUNDOS}s`
          };
          if (!alertasDetectados.some(a => a.horario === alerta.horario)) {
            alertasDetectados.push(alerta);
          }
        }
      });

      setAlertas(alertasDetectados);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "1rem", marginLeft: 50 }}>
      <h3>Alertas de hoje</h3>
      {alertas.length === 0 ? (
        <p>Nenhum alerta registrado hoje.</p>
      ) : (
        <ul>
          {alertas.map((alerta, index) => (
            <li key={index}>{alerta.mensagem}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertList;
