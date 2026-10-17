export function formatDisplayDate(value: string): string {
  if (!value) {
    return "TT.MM.JJJJ";
  }

  const [year, month, day] = value.split("-");

  return `${day}.${month}.${year}`;
}
