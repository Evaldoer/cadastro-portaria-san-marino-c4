import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CadastroEntregas() {
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [bloco, setBloco] = useState("");
  const [apartamento, setApartamento] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("entregas")
      .insert([
        { descricao, quantidade, bloco, apartamento, foto_url: fotoUrl },
      ])
      .select();

    if (error) {
      setMensagem(`Erro: ${error.message}`);
    } else {
      setMensagem("Entrega cadastrada com sucesso!");
      setDescricao("");
      setQuantidade("");
      setBloco("");
      setApartamento("");
      setFotoUrl("");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Cadastro de Entregas</h2>
      <form onSubmit={handleSubmit}>
        <label>Descrição:</label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <label>Quantidade:</label>
        <input
          type="number"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />

        <label>Bloco:</label>
        <input
          value={bloco}
          onChange={(e) => setBloco(e.target.value)}
          required
        />

        <label>Apartamento:</label>
        <input
          value={apartamento}
          onChange={(e) => setApartamento(e.target.value)}
          required
        />

        <label>Foto (URL):</label>
        <input value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} />

        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}