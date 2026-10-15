/** Insere pontos de quebra opcionais em nomes camelCase ("CyborgGames" → "Cyborg<wbr>Games"). */
export function Breakable({ text }: { text: string }) {
  const parts = text.split(/(?<=[a-z])(?=[A-Z])/);
  return parts.map((part, index) => (
    <span key={part + index}>
      {index > 0 && <wbr />}
      {part}
    </span>
  ));
}
