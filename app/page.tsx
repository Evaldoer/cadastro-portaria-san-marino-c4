import Link from "next/link";

const atalhos = [
  {
    href: "/registrar-visitante",
    titulo: "Registrar visitante",
    descricao: "Cadastre entradas com rapidez para liberar o acesso.",
  },
  {
    href: "/visitantes",
    titulo: "Consultar visitantes",
    descricao: "Veja a lista recente de cadastros da portaria.",
  },
  {
    href: "/registrar-entrega",
    titulo: "Registrar entrega",
    descricao: "Anote encomendas recebidas para os apartamentos.",
  },
  {
    href: "/entregas",
    titulo: "Consultar entregas",
    descricao: "Acompanhe o historico de encomendas registradas.",
  },
  {
    href: "/encomendas",
    titulo: "Area de encomendas",
    descricao: "Acesse o painel dedicado para entregas destinadas aos moradores.",
  },
];

export default function HomePage() {
  return (
    <div className="home-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Painel da portaria</span>
          <h2>Bem-vindo ao sistema da Portaria San Marino</h2>
          <p className="hero-text">
            Organize visitantes e entregas em um so lugar, com acessos rapidos
            para o atendimento do dia a dia.
          </p>
          <div className="hero-actions">
            <Link href="/registrar-visitante" className="quick-link quick-link-primary">
              Novo visitante
            </Link>
            <Link href="/registrar-entrega" className="quick-link">
              Nova entrega
            </Link>
          </div>
        </div>

        <div className="status-card">
          <p className="status-label">Rotina sugerida</p>
          <ol className="status-list">
            <li>Cadastre a entrada assim que o visitante chegar.</li>
            <li>Confirme apartamento e documento antes de liberar.</li>
            <li>Registre encomendas assim que forem recebidas.</li>
          </ol>
        </div>
      </section>

      <section className="shortcut-grid">
        {atalhos.map((atalho) => (
          <Link key={atalho.href} href={atalho.href} className="shortcut-card">
            <strong>{atalho.titulo}</strong>
            <p>{atalho.descricao}</p>
            <span>Acessar</span>
          </Link>
        ))}
      </section>

      <section className="info-grid">
        <article className="info-card">
          <h3>Fluxo rapido</h3>
          <p>
            Use os atalhos acima para registrar movimentacoes sem precisar
            navegar pelo menu completo.
          </p>
        </article>

        <article className="info-card">
          <h3>Consulta centralizada</h3>
          <p>
            As listas de visitantes e entregas ajudam a conferir o que foi
            registrado durante o turno.
          </p>
        </article>

        <article className="info-card">
          <h3>Atendimento mais claro</h3>
          <p>
            Mantenha os dados organizados para reduzir erros e agilizar a
            comunicacao com moradores.
          </p>
        </article>
      </section>
    </div>
  );
}
