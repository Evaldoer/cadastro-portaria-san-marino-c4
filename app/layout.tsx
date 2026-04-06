import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <div className="brand-block">
              <Link href="/" className="brand-link">
                <span className="brand-mark">SM</span>
                <div>
                  <strong>Portaria San Marino</strong>
                  <p>Controle de visitantes e entregas</p>
                </div>
              </Link>
            </div>

            <nav className="site-nav" aria-label="Navegacao principal">
              <Link href="/" className="nav-link">
                Inicio
              </Link>
              <Link href="/visitantes" className="nav-link">
                Visitantes
              </Link>
              <Link href="/entregas" className="nav-link">
                Entregas
              </Link>
              <Link href="/encomendas" className="nav-link">
                Encomendas
              </Link>
              <Link href="/registrar-visitante" className="nav-link nav-link-accent">
                Registrar visitante
              </Link>
              <Link href="/registrar-entrega" className="nav-link nav-link-accent">
                Registrar entrega
              </Link>
              <Link href="/registrar-encomenda" className="nav-link nav-link-accent">
                Registrar encomenda
              </Link>
            </nav>
          </div>
        </header>

        <main className="site-main">
          <div className="page-shell">{children}</div>
        </main>
      </body>
    </html>
  );
}
