// Formatação de datas sem Intl/fuso horário: o resultado é idêntico na
// pré-renderização (Node) e no navegador, evitando divergências de hidratação.

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MONTHS_LONG = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function parts(iso: string): [number, number, number] {
  const [y = "0", m = "1", d = "1"] = iso.split("-");
  return [Number(y), Number(m), Number(d)];
}

/** "2026-10-09" → "out 2026" */
export function monthYear(iso: string): string {
  const [y, m] = parts(iso);
  return `${MONTHS[m - 1]} ${y}`;
}

/** "2026-10-09" → "outubro de 2026" */
export function monthYearLong(iso: string): string {
  const [y, m] = parts(iso);
  return `${MONTHS_LONG[m - 1]} de ${y}`;
}

/** "2026-10-09" → "09/10/2026" */
export function shortDate(iso: string): string {
  const [y, m, d] = parts(iso);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

export function year(iso: string): number {
  return parts(iso)[0];
}
