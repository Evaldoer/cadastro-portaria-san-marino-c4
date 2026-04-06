import EntregaListPage from "@/app/_components/EntregaListPage";

export default function EntregasPage() {
  return (
    <EntregaListPage
      categoria="entrega"
      titulo="Lista de Entregas"
      descricao="Pesquise por descricao, bloco ou apartamento."
      placeholderBusca="Buscar por bloco ou apartamento"
      vazioTexto="Nenhuma entrega cadastrada."
      vazioBuscaTexto="Nenhuma entrega encontrada para a busca informada."
    />
  );
}
