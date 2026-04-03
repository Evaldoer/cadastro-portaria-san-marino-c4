import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CadastroEntregas() {
  const [descricao, setDescricao] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [bloco, setBloco] = useState("");
  const [apartamento, setApartamento] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [entregas, setEntregas] = useState([]);

  // ================= FORMATAR DATA (CORRIGIDO) =================
  function formatarData(data) {
    if (!data) return "";

    return new Date(data + "Z").toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  }

  // ================= CARREGAR ENTREGAS =================
  const fetchEntregas = async () => {
    const { data, error } = await supabase
      .from("entregas")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setEntregas(data);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("entregas").insert([
      {
        descricao,
        quantidade,
        bloco,
        apartamento,
        foto_url: fotoUrl,
        // ❌ NÃO enviar data_hora
      },
    ]);

    if (error) {
      setMensagem(`Erro: ${error.message}`);
      return;
    }

    setMensagem("Entrega cadastrada com sucesso!");

    // limpar formulário
    setDescricao("");
    setQuantidade("");
    setBloco("");
    setApartamento("");
    setFotoUrl("");

    // recarregar lista
    fetchEntregas();
  };

  // ================= INIT =================
  useEffect(() => {
    (async () => {
      await fetchEntregas();
    })();

    const interval = setInterval(fetchEntregas, 5000);
    return () => clearInterval(interval);
  }, []);

  // ================= UI =================
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Cadastro de Entregas
      </h2>

      <form onSubmit={handleSubmit}>
        <label>Descrição:</label>
        <input
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <label>Quantidade:</label>
        <input
          type="number"
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          required
        />

        <label>Bloco:</label>
        <input
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          value={bloco}
          onChange={(e) => setBloco(e.target.value)}
          required
        />

        <label>Apartamento:</label>
        <input
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          value={apartamento}
          onChange={(e) => setApartamento(e.target.value)}
          required
        />

        <label>Foto (URL):</label>
        <input
          style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
          value={fotoUrl}
          onChange={(e) => setFotoUrl(e.target.value)}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cadastrar
        </button>
      </form>

      {mensagem && (
        <p style={{ marginTop: "15px", textAlign: "center", color: "green" }}>
          {mensagem}
        </p>
      )}

      <h3 style={{ marginTop: "30px" }}>Entregas cadastradas:</h3>

      <ul>
        {entregas.map((item) => (
          <li key={item.id}>
            {item.descricao} - {item.quantidade} unidades - Bloco {item.bloco} - Apto {item.apartamento}
            <br />

            🕒 Registrado em: {formatarData(item.data_hora)}
          </li>
        ))}
      </ul>
    </div>
  );
}