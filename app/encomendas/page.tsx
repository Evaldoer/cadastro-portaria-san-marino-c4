import EntregaListPage from "@/app/_components/EntregaListPage";

export default function EncomendasPage() {
  return (
    <EntregaListPage
      categoria="encomenda"
      titulo="Lista de Encomendas"
      descricao="Pesquise encomendas por descricao, bloco ou apartamento."
      placeholderBusca="Buscar encomenda por bloco ou apartamento"
      vazioTexto="Nenhuma encomenda cadastrada."
      vazioBuscaTexto="Nenhuma encomenda encontrada para a busca informada."
    />
  );
}
