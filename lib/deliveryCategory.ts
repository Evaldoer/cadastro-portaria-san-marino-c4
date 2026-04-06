export type DeliveryCategory = "entrega" | "encomenda";

const PREFIX_BY_CATEGORY: Record<DeliveryCategory, string> = {
  entrega: "[ENTREGA]",
  encomenda: "[ENCOMENDA]",
};

export function normalizeDeliveryCategory(value: FormDataEntryValue | string | null | undefined): DeliveryCategory {
  return value === "encomenda" ? "encomenda" : "entrega";
}

export function encodeDeliveryDescription(descricao: string, categoria: DeliveryCategory) {
  const cleanDescription = stripDeliveryPrefix(descricao).trim();
  return `${PREFIX_BY_CATEGORY[categoria]} ${cleanDescription}`.trim();
}

export function getDeliveryCategoryFromDescription(descricao: string | null | undefined): DeliveryCategory {
  if (!descricao) {
    return "entrega";
  }

  return descricao.startsWith(PREFIX_BY_CATEGORY.encomenda) ? "encomenda" : "entrega";
}

export function stripDeliveryPrefix(descricao: string | null | undefined) {
  if (!descricao) {
    return "";
  }

  return descricao
    .replace(PREFIX_BY_CATEGORY.encomenda, "")
    .replace(PREFIX_BY_CATEGORY.entrega, "")
    .trim();
}
