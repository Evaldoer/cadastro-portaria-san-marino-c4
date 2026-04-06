"use client";
import { useState } from "react";

export default function RegistrarVisitantePage() {
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [apartamento, setApartamento] = useState("");

  const registrar = async () => {
    await fetch("/api/visitantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, rg, apartamento }),
    });
    alert("Visitante registrado!");
  };

  return (
    <div>
      <h2>➕ Registrar Visitante</h2>
      <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input placeholder="RG" value={rg} onChange={(e) => setRg(e.target.value)} />
      <input placeholder="Apartamento" value={apartamento} onChange={(e) => setApartamento(e.target.value)} />
      <button onClick={registrar}>Registrar</button>
    </div>
  );
}