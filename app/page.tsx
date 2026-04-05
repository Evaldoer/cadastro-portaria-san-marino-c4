"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// ================= TIPOS =================
type Visitante = {
  id: number;
  nome: string;
  rg: string;
  apartamento: string;
  data?: string;
};

type Entrega = {
  id: number;
  descricao: string;
  quantidade: string;
  bloco: string;
  apartamento: string;
  foto?: string;
  data?: string;
};

// ================= COMPONENTE =================
export default function Home() {
  const [visitantes, setVisitantes] = useState<Visitante[]>([]);
  const [entregas, setEntregas] = useState<Entrega[]>([]);

  // ================= DATA =================
  function formatarData(data?: string) {
    if (!data) return "";
    return new Date(data).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ================= VISITANTES =================
  async function carregarVisitantes() {
    const res = await fetch("/api/visitantes", { cache: "no-store" });
    const data = await res.json();
    setVisitantes(Array.isArray(data) ? data : []);
  }

  async function registrarVisitante(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    const nome = (form.elements.namedItem("nome") as HTMLInputElement).value;
    const rg = (form.elements.namedItem("rg") as HTMLInputElement).value;
    const apartamento = (form.elements.namedItem("apartamento") as HTMLInputElement).value;

    await fetch("/api/visitantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, rg, apartamento }),
    });

    form.reset();
    carregarVisitantes();
  }

  async function excluirVisitante(id: number) {
    await fetch("/api/visitantes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    carregarVisitantes();
  }

  async function editarVisitante(v: Visitante) {
    const nome = prompt("Novo nome:", v.nome);
    if (!nome) return;

    await fetch("/api/visitantes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...v, nome }),
    });

    carregarVisitantes();
  }

  // ================= ENTREGAS =================
  async function carregarEntregas() {
    const res = await fetch("/api/entregas", { cache: "no-store" });
    const data = await res.json();
    setEntregas(Array.isArray(data) ? data : []);
  }

  async function registrarEntrega(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const foto = formData.get("foto") as File;

    if (foto && foto.size === 0) {
      formData.delete("foto");
    }

    const res = await fetch("/api/entregas", {
      method: "POST",
      body: formData,
    });

    const novaEntrega = await res.json();

    if (novaEntrega && novaEntrega.id) {
      setEntregas((prev) => [novaEntrega, ...prev]);
    }

    form.reset();
  }

  async function excluirEntrega(id: number) {
    await fetch("/api/entregas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    carregarEntregas();
  }

  async function editarEntrega(e: Entrega) {
    const descricao = prompt("Nova descrição:", e.descricao);
    if (!descricao) return;

    await fetch("/api/entregas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...e, descricao }),
    });

    carregarEntregas();
  }

  // ================= INIT =================
  useEffect(() => {
    async function init() {
      await carregarVisitantes();
      await carregarEntregas();
    }

    init();
  }, []);

  // ================= UI =================
  return (
    <>
      <header className="header">🏢 Portaria San Marino</header>

      <div className="container grid">
        {/* VISITANTE */}
        <div className="card">
          <h2>👤 Registrar Visitante</h2>
          <form onSubmit={registrarVisitante}>
            <input name="nome" placeholder="Nome" required />
            <input name="rg" placeholder="RG" required />
            <input name="apartamento" placeholder="Apartamento" required />
            <button type="submit">Registrar</button>
          </form>
        </div>

        {/* ENTREGA */}
        <div className="card">
          <h2>📦 Registrar Entrega</h2>
          <form onSubmit={registrarEntrega}>
            <input name="descricao" placeholder="Descrição" required />
            <input name="quantidade" placeholder="Quantidade" required />
            <input name="bloco" placeholder="Bloco" required />
            <input name="apartamento" placeholder="Apartamento" required />

            <input
              name="foto"
              type="file"
              accept="image/*"
              onChange={(e) =>
                console.log("📸 Arquivo escolhido:", e.target.files?.[0])
              }
            />

            <button type="submit">Registrar</button>
          </form>
        </div>

        {/* VISITANTES */}
        <div className="card">
          <h2>📋 Visitantes</h2>
          <ul>
            {visitantes.map((v) => (
              <li key={v.id}>
                👤 {v.nome} - RG: {v.rg}
                <br />
                🏠 Ap {v.apartamento}
                <br />
                🕒 {formatarData(v.data)}
                <div className="actions">
                  <button className="btn-edit" onClick={() => editarVisitante(v)}>✏️</button>
                  <button className="btn-delete" onClick={() => excluirVisitante(v.id)}>❌</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ENTREGAS */}
        <div className="card">
          <h2>📦 Entregas</h2>
          <ul>
            {entregas.map((e) => (
              <li key={e.id}>
                📦 {e.descricao} - {e.quantidade}
                <br />
                🏢 Bloco {e.bloco} Ap {e.apartamento}
                <br />
                🕒 {formatarData(e.data)}

                {e.foto ? (
                  <Image
                    src={e.foto}
                    alt="Foto da entrega"
                    width={120}
                    height={120}
                    style={{ marginTop: 8, border: "1px solid #ccc" }}
                  />
                ) : (
                  <p style={{ color: "#999" }}>Sem imagem</p>
                )}

                <div className="actions">
                  <button className="btn-edit" onClick={() => editarEntrega(e)}>✏️</button>
                  <button className="btn-delete" onClick={() => excluirEntrega(e.id)}>❌</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}