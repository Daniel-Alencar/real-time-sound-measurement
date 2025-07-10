import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";

// Estrutura dos dados vindos do Firebase
interface FirebaseEntry {
  data_hora: string;
  microfone: number;
}

interface Alerta {
  horario: string;
  mensagem: string;
}

// Configuração
const LIMITE_DB = 70;
const TEMPO_MINIMO_SEGUNDOS = 4;
const DELAY_SOUND_MEASUREMENT_MS = 1000;
const MIN_SEQ_LENGTH = TEMPO_MINIMO_SEGUNDOS * 1000 / DELAY_SOUND_MEASUREMENT_MS;

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
        .filter((e): e is FirebaseEntry => e 
          && typeof e.data_hora === "string" 
          && typeof e.microfone === "number"
        )
        .sort((a, b) => a.data_hora.localeCompare(b.data_hora));

      const novosAlertas: Alerta[] = [];
      let sequencia: FirebaseEntry[] = [];

      for (let i = 0; i < entradasOrdenadas.length; i++) {
        const entrada = entradasOrdenadas[i];

        if (entrada.microfone >= LIMITE_DB) {
          sequencia.push(entrada);
        } else {
          if (sequencia.length >= MIN_SEQ_LENGTH) {
            const primeiro = sequencia[0];
            const alerta: Alerta = {
              horario: primeiro.data_hora,
              mensagem: `No dia ${currentDate} no horário ${primeiro.data_hora}, as medições ultrapassaram ${LIMITE_DB}dB por cerca de ${TEMPO_MINIMO_SEGUNDOS}s`
            };

            // Evita alerta duplicado para mesma hora
            if (!novosAlertas.some(a => a.horario === alerta.horario)) {
              novosAlertas.push(alerta);
            }
          }
          sequencia = [];
        }

        // Caso o último valor seja alto e a sequência continue no fim
        if (i === entradasOrdenadas.length - 1 && sequencia.length >= MIN_SEQ_LENGTH) {
          const primeiro = sequencia[0];
          const alerta: Alerta = {
            horario: primeiro.data_hora,
            mensagem: `No dia ${currentDate} no horário ${primeiro.data_hora}, as medições ultrapassaram ${LIMITE_DB}dB por cerca de ${TEMPO_MINIMO_SEGUNDOS}s`
          };

          if (!novosAlertas.some(a => a.horario === alerta.horario)) {
            novosAlertas.push(alerta);
          }
        }
      }

      // Só atualiza se houver novos alertas
      setAlertas(prevAlertas => {
        const combinados = [...prevAlertas];
        novosAlertas.forEach(alerta => {
          if (!combinados.some(a => a.horario === alerta.horario)) {
            combinados.push(alerta);
          }
        });
        return combinados;
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "1rem", marginLeft: 50 }}>
      <h3>Alertas de Hoje</h3>
      {alertas.length === 0 ? (
        <p>Nenhum alerta registrado.</p>
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
