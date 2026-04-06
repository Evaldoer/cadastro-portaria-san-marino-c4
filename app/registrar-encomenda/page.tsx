import RegistrarEntregaForm from "@/app/_components/RegistrarEntregaForm";

export default function RegistrarEncomendaPage() {
  return (
    <RegistrarEntregaForm
      categoria="encomenda"
      titulo="Registrar Encomenda"
      descricaoPagina="Cadastre encomendas destinadas aos moradores com foto, bloco, apartamento e leitura de codigo."
    />
  );
}
