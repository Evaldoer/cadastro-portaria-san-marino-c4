"use client";

import { formatLocalDateTime } from "@/lib/dateTime";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

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
  const [busca, setBusca] = useState("");

  async function deletarEntrega(id: number) {
    const confirmado = window.confirm("Deseja excluir esta entrega?");

    if (!confirmado) {
      return;
    }

    const response = await fetch("/api/entregas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      return;
    }

    setEntregas((listaAtual) => listaAtual.filter((entrega) => entrega.id !== id));
  }

  useEffect(() => {
    fetch("/api/entregas")
      .then((res) => res.json())
      .then(setEntregas);
  }, []);

  const entregasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return entregas;
    }

    return entregas.filter((entrega) => {
      return (
        entrega.descricao.toLowerCase().includes(termo) ||
        entrega.bloco.toLowerCase().includes(termo) ||
        entrega.apartamento.toLowerCase().includes(termo)
      );
    });
  }, [busca, entregas]);

  return (
    <div className="delivery-page">
      <div className="delivery-header">
        <div>
          <h2>Lista de Entregas</h2>
          <p>Pesquise por descricao, bloco ou apartamento.</p>
        </div>
        <input
          className="delivery-search"
          placeholder="Buscar por bloco ou apartamento"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {entregas.length === 0 ? (
        <p>Nenhuma entrega cadastrada.</p>
      ) : entregasFiltradas.length === 0 ? (
        <p>Nenhuma entrega encontrada para a busca informada.</p>
      ) : (
        <ul className="delivery-list">
          {entregasFiltradas.map((entrega) => (
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
                <div className="actions">
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => deletarEntrega(entrega.id)}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
