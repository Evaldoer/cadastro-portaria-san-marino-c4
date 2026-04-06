"use client";

import { formatLocalDateTime } from "@/lib/dateTime";
import Image from "next/image";
import { useEffect, useState } from "react";

type Entrega = {
  id: number;
  descricao: string;
  quantidade: string | number;
  bloco: string;
  apartamento: string;
  foto?: string;
  data?: string;
};

export default function EntregasPage() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);

  useEffect(() => {
    fetch("/api/entregas")
      .then((res) => res.json())
      .then(setEntregas);
  }, []);

  return (
    <div className="delivery-page">
      <h2>Lista de Entregas</h2>
      {entregas.length === 0 ? (
        <p>Nenhuma entrega cadastrada.</p>
      ) : (
        <ul className="delivery-list">
          {entregas.map((entrega) => (
            <li key={entrega.id} className="entrega delivery-card">
              <div className="delivery-media">
                {entrega.foto ? (
                  <Image
                    src={entrega.foto}
                    alt={`Foto da entrega ${entrega.descricao}`}
                    width={220}
                    height={160}
                    className="delivery-image"
                  />
                ) : (
                  <div className="delivery-placeholder">Sem foto</div>
                )}
              </div>

              <div className="delivery-content">
                <strong>{entrega.descricao}</strong>
                <div className="delivery-meta">Quantidade: {entrega.quantidade}</div>
                <div className="delivery-meta">
                  Bloco {entrega.bloco} Ap {entrega.apartamento}
                </div>
                <div className="delivery-meta">Registrado em: {formatLocalDateTime(entrega.data)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
