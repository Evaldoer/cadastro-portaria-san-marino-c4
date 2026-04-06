const LOCALE = "pt-BR";
const TIME_ZONE = "America/Sao_Paulo";

export function getLocalDateTimeForDatabase() {
  return new Date().toLocaleString("sv-SE", {
    timeZone: TIME_ZONE,
  });
}

export function formatLocalDateTime(value?: string | null) {
  if (!value) {
    return "Nao informado";
  }

  const normalizedValue = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(LOCALE, {
    timeZone: TIME_ZONE,
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
