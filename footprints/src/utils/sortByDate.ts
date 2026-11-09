export function sortByDate<T extends { id: string }>(
  items: readonly T[],
  getDate: (item: T) => string,
): T[] {
  return [...items].sort((a, b) => {
    const dateA = getDate(a);
    const dateB = getDate(b);

    if (dateA !== dateB) {
      return dateA > dateB ? -1 : 1;
    }

    if (a.id === b.id) {
      return 0;
    }

    return a.id < b.id ? -1 : 1;
  });
}
