"use client";

import { formatLocalDateTime } from "@/lib/dateTime";
import { useEffect, useMemo, useState } from "react";

type Visitante = {
  id: number;
  nome: string;
  rg?: string;
  cpf?: string;
  apartamento: string;
  data?: string;
};

function normalizarDocumento(valor: string) {
  return valor.replace(/\D/g, "");
}

export default function VisitantesPage() {
  const [visitantes, setVisitantes] = useState<Visitante[]>([]);
  const [busca, setBusca] = useState("");
  const [erro, setErro] = useState("");

  async function deletarVisitante(id: number) {
    const confirmado = window.confirm("Deseja excluir este visitante?");

    if (!confirmado) {
      return;
    }

    try {
      const response = await fetch("/api/visitantes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Falha ao excluir visitante.");
      }

      setVisitantes((listaAtual) => listaAtual.filter((visitante) => visitante.id !== id));
    } catch {
      setErro("Nao foi possivel excluir o visitante.");
    }
  }

  useEffect(() => {
    async function carregarVisitantes() {
      try {
        const response = await fetch("/api/visitantes");

        if (!response.ok) {
          throw new Error("Falha ao carregar visitantes.");
        }

        const data = (await response.json()) as Visitante[];
        setVisitantes(data);
      } catch {
        setErro("Nao foi possivel carregar os visitantes no momento.");
      }
    }

    carregarVisitantes();
  }, []);

  const termo = normalizarDocumento(busca);

  const visitantesFiltrados = useMemo(() => {
    if (!busca.trim()) {
      return visitantes;
    }

    const buscaTexto = busca.trim().toLowerCase();

    return visitantes.filter((visitante) => {
      const rg = normalizarDocumento(visitante.rg ?? "");
      const cpf = normalizarDocumento(visitante.cpf ?? "");
      const nome = visitante.nome.toLowerCase();
      const apartamento = visitante.apartamento.toLowerCase();

      return (
        nome.includes(buscaTexto) ||
        apartamento.includes(buscaTexto) ||
        (termo.length > 0 && (rg.includes(termo) || cpf.includes(termo)))
      );
    });
  }, [busca, termo, visitantes]);

  return (
    <div className="visitors-page">
      <div className="visitors-header">
        <div>
          <h2>Lista de Visitantes</h2>
          <p>Pesquise por nome, apartamento, RG ou CPF.</p>
        </div>
        <input
          className="visitors-search"
          placeholder="Buscar por nome, RG ou CPF"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {erro ? <p>{erro}</p> : null}

      {!erro && visitantes.length === 0 ? <p>Nenhum visitante cadastrado.</p> : null}

      {!erro && visitantes.length > 0 && visitantesFiltrados.length === 0 ? (
        <p>Nenhum visitante encontrado para a busca informada.</p>
      ) : null}

      {visitantesFiltrados.length > 0 ? (
        <ul className="visitors-list">
          {visitantesFiltrados.map((visitante) => (
            <li key={visitante.id} className="visitante visitor-card">
              <strong>{visitante.nome}</strong>
              <div className="visitor-meta">RG: {visitante.rg || "Nao informado"}</div>
              <div className="visitor-meta">CPF: {visitante.cpf || "Nao informado"}</div>
              <div className="visitor-meta">Apartamento: {visitante.apartamento}</div>
              <div className="visitor-meta">Registrado em: {formatLocalDateTime(visitante.data)}</div>
              <div className="actions">
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => deletarVisitante(visitante.id)}
                >
                  Deletar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
